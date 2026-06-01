import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/services/prisma.service';
import { OtpService } from './otp.service';
import type { SendOtpDto, VerifyOtpDto, CreateProfileDto, RegisterDto, LoginDto } from './dto/auth.dto';
import type { User, UserProfile } from '@prisma/client';

// Use require to avoid webpack bundling bcrypt's native dependencies
const bcrypt = require('bcrypt');

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: User & { profile: UserProfile | null };
  tokens: TokenPair;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const existingHandle = await this.prisma.userProfile.findUnique({ where: { handle: dto.handle } });
    if (existingHandle) throw new ConflictException('Handle is already taken');

    const passwordHash = await bcrypt.hash(dto.password, 10);
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
    await this.createSession(user.id, tokens);

    return { user, tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true },
    });

    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid email or password');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid email or password');

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const tokens = await this.generateTokens(user);
    await this.createSession(user.id, tokens);

    return { user, tokens };
  }

  async sendOtp(dto: SendOtpDto) {
    return this.otpService.sendOtp(dto.phoneNumber);
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<AuthResponse> {
    const result = await this.otpService.verifyOtp(dto.phoneNumber, dto.code);
    if (!result) throw new UnauthorizedException('Invalid OTP');

    const { phoneNumber, code } = result;
    let user = await this.findUserByPhone(phoneNumber);

    if (!user) {
      user = await this.createUserFromPhone(phoneNumber);
    }

    await this.updateUserLastLogin(user.id);
    const tokens = await this.generateTokens(user);
    await this.createSession(user.id, tokens);

    return { user, tokens };
  }

  private async findUserByPhone(phoneNumber: string) {
    return this.prisma.user.findUnique({
      where: { phoneNumber },
      include: { profile: true },
    });
  }

  private async createUserFromPhone(phoneNumber: string) {
    return this.prisma.user.create({
      data: {
        phoneNumber,
        phoneVerified: true,
        profile: { create: {} },
      },
      include: { profile: true },
    });
  }

  private async updateUserLastLogin(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  async createProfile(userId: string, dto: CreateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.userProfile.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });

    return { profile: updated };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: this.config.get('JWT_REFRESH_SECRET') });
      const session = await this.prisma.userSession.findFirst({
        where: { refreshToken, revoked: false },
        include: { user: { include: { profile: true } } },
      });

      if (!session || session.expiresAt < new Date()) throw new UnauthorizedException('Session expired');

      const tokens = await this.generateTokens(session.user);
      await this.prisma.userSession.update({ where: { id: session.id }, data: { refreshToken: tokens.refreshToken } });

      return { tokens };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, token: string) {
    await this.prisma.userSession.updateMany({
      where: { userId, refreshToken: token },
      data: { revoked: true },
    });
    return { success: true };
  }

  async logoutAll(userId: string) {
    await this.prisma.userSession.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
    return { success: true };
  }

  private async generateTokens(user: User): Promise<TokenPair> {
    const payload = { sub: user.id, phone: user.phoneNumber };
    const accessToken = this.jwtService.sign(payload, { secret: this.config.get('JWT_SECRET'), expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { secret: this.config.get('JWT_REFRESH_SECRET'), expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  private async createSession(userId: string, tokens: TokenPair) {
    await this.prisma.userSession.create({
      data: {
        userId,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }
}
