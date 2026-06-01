import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { get } from 'https';
import { PrismaService } from '../common/services/prisma.service';
import { OtpService } from './otp.service';
import type { SendOtpDto, VerifyOtpDto, CreateProfileDto, RegisterDto, LoginDto } from './dto/auth.dto';
import type { User, UserProfile } from '@prisma/client';

/* ── Pure Node.js password hashing (no bcrypt/webpack issues) ── */
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const hashVerify = scryptSync(password, salt, 64).toString('hex');
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(hashVerify, 'hex'));
}

/* ── ZeroBounce Email Verification ── */
function verifyEmailWithZeroBounce(email: string, apiKey: string): Promise<{ valid: boolean; reason?: string }> {
  if (!apiKey) return Promise.resolve({ valid: true });
  const url = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${encodeURIComponent(email)}&ip_address=`;
  return new Promise((resolve) => {
    get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const badStatuses = ['invalid', 'spamtrap', 'abuse', 'do_not_mail'];
          if (badStatuses.includes(result.status)) {
            resolve({ valid: false, reason: `Email is ${result.status}` });
          } else {
            resolve({ valid: true });
          }
        } catch {
          resolve({ valid: true });
        }
      });
    }).on('error', () => resolve({ valid: true }));
  });
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  /* ── Email/Password Registration ── */
  async register(dto: RegisterDto) {
    // Verify email with ZeroBounce
    const apiKey = this.config.get('ZEROBOUNCE_API_KEY') || '';
    const emailCheck = await verifyEmailWithZeroBounce(dto.email, apiKey);
    if (!emailCheck.valid) {
      throw new ConflictException(`Invalid email: ${emailCheck.reason}. Please use a real email address.`);
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const existingHandle = await this.prisma.userProfile.findUnique({ where: { handle: dto.handle } });
    if (existingHandle) throw new ConflictException('Handle already taken');

    const passwordHash = hashPassword(dto.password);
    const phonePlaceholder = `+880000000${Math.floor(1000 + Math.random() * 8999)}`;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        emailVerified: true,
        passwordHash,
        phoneNumber: phonePlaceholder,
        phoneVerified: false,
        profile: {
          create: {
            legalName: dto.legalName,
            displayName: dto.legalName,
            handle: dto.handle,
            districtId: dto.districtId,
          },
        },
      },
      include: { profile: true },
    });

    await this.prisma.userSettings.create({ data: { userId: user.id } });
    await this.prisma.userPreference.create({ data: { userId: user.id } });

    const tokens = await this.generateTokens(user);
    return { user, tokens };
  }

  /* ── Email/Password Login ── */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = verifyPassword(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid email or password');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user);
    return { user, tokens };
  }

  /* ── OTP Phone Auth (existing flow) ── */
  async sendOtp(dto: SendOtpDto) {
    return this.otpService.sendOtp(dto.phoneNumber);
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const isValid = await this.otpService.verifyOtp(dto.phoneNumber, dto.otp);
    if (!isValid) throw new UnauthorizedException('Invalid OTP');

    let user = await this.prisma.user.findUnique({
      where: { phoneNumber: dto.phoneNumber },
      include: { profile: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phoneNumber: dto.phoneNumber,
          phoneVerified: true,
          profile: { create: { legalName: dto.phoneNumber, displayName: dto.phoneNumber } },
        },
        include: { profile: true },
      });
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user);
    return { user, tokens };
  }

  /* ── Profile ── */
  async createProfile(userId: string, dto: CreateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        legalName: dto.legalName,
        displayName: dto.legalName,
        handle: dto.handle,
        districtId: dto.districtId ?? 1,
      },
      update: {
        legalName: dto.legalName,
        displayName: dto.legalName,
        handle: dto.handle,
        districtId: dto.districtId ?? undefined,
      },
    });

    return { profile: updated };
  }

  /* ── Tokens ── */
  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { profile: true },
      });
      if (!user) throw new UnauthorizedException('User not found');
      const tokens = await this.generateTokens(user);
      return { tokens };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(_userId: string, _token: string) {
    return { success: true };
  }

  async logoutAll(_userId: string) {
    return { success: true };
  }

  private async generateTokens(user: User & { profile?: UserProfile | null }): Promise<TokenPair> {
    const payload = { sub: user.id, phone: user.phoneNumber };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
}
