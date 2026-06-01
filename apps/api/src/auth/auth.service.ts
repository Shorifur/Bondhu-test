import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/services/prisma.service';
import { RedisService } from '../common/services/redis.service';
import { OtpService } from './otp.service';
import type { SendOtpDto, VerifyOtpDto, CreateProfileDto, RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import type { User, UserProfile } from '@prisma/client';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly otp: OtpService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const { phoneNumber } = dto;

    const { canResend, waitSeconds } = await this.otp.canResend(phoneNumber);
    if (!canResend) {
      throw new BadRequestException(`Please wait ${waitSeconds} seconds before requesting a new OTP`);
    }

    const result = await this.otp.sendOtp(phoneNumber);
    return {
      message: 'OTP sent successfully',
      expiresIn: result.expiresIn,
      ...(this.config.get('app.nodeEnv') !== 'production' && { otp: result.otp }),
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { phoneNumber, otp } = dto;

    const valid = await this.otp.verifyOtp(phoneNumber, otp);
    if (!valid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    let user = await this.prisma.user.findUnique({
      where: { phoneNumber },
      include: { profile: true },
    });

    const isNewUser = !user;

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phoneNumber,
          phoneVerified: true,
        },
        include: { profile: true },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true, lastLoginAt: new Date() },
      });
    }

    const tokens = await this.generateTokens(user);
    await this.createSession(user.id, tokens);

    return {
      user,
      tokens,
      isNewUser,
      requiresProfile: isNewUser || !user.profile,
    };
  }

  async register(dto: RegisterDto) {
    // Check if email exists
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Check if handle exists
    const existingHandle = await this.prisma.userProfile.findUnique({
      where: { handle: dto.handle },
    });
    if (existingHandle) {
      throw new ConflictException('Handle is already taken');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Generate a unique phone placeholder for email users
    const phonePlaceholder = `+880000000${Math.floor(1000 + Math.random() * 8999)}`;

    // Create user with profile
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        emailVerified: true,
        passwordHash,
        phoneNumber: phonePlaceholder,
        phoneVerified: false,
        gender: dto.gender,
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

    // Create settings and preferences
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

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user);
    await this.createSession(user.id, tokens);

    return { user, tokens };
  }

  async createProfile(userId: string, dto: CreateProfileDto) {
    const existingHandle = await this.prisma.userProfile.findUnique({
      where: { handle: dto.handle },
    });

    if (existingHandle) {
      throw new ConflictException('Handle is already taken');
    }

    const profile = await this.prisma.userProfile.create({
      data: {
        userId,
        legalName: dto.legalName,
        displayName: dto.legalName,
        handle: dto.handle,
        districtId: dto.districtId,
        subDistrictId: dto.subDistrictId,
        handleLockedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    await this.prisma.userSettings.create({
      data: { userId },
    });

    await this.prisma.userPreference.create({
      data: { userId },
    });

    return profile;
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: this.config.get<string>('app.jwtRefreshSecret'),
      });

      const session = await this.prisma.session.findFirst({
        where: {
          userId: payload.sub,
          refreshToken,
          refreshExpiresAt: { gt: new Date() },
        },
        include: { user: { include: { profile: true } } },
      });

      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(session.user);
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
          refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, token: string) {
    await this.prisma.session.deleteMany({
      where: { userId, token },
    });

    // Add to blocklist
    try {
      const payload = this.jwt.decode(token) as { jti?: string; exp?: number };
      if (payload?.jti && payload?.exp) {
        const ttl = payload.exp - Math.floor(Date.now() / 1000);
        await this.redis.set(`auth:blocklist:${payload.jti}`, 'revoked', ttl);
      }
    } catch {
      // Ignore decode errors
    }

    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string) {
    await this.prisma.session.deleteMany({
      where: { userId },
    });
    return { message: 'Logged out from all devices' };
  }

  private async generateTokens(user: User & { profile?: UserProfile | null }): Promise<TokenPair> {
    const accessPayload = {
      sub: user.id,
      phone: user.phoneNumber,
      type: 'access',
      jti: crypto.randomUUID(),
    };

    const refreshPayload = {
      sub: user.id,
      phone: user.phoneNumber,
      type: 'refresh',
      jti: crypto.randomUUID(),
    };

    const accessToken = this.jwt.sign(accessPayload, {
      secret: this.config.get<string>('app.jwtSecret'),
      expiresIn: this.config.get<string>('app.jwtAccessExpiration') || '15m',
    });

    const refreshToken = this.jwt.sign(refreshPayload, {
      secret: this.config.get<string>('app.jwtRefreshSecret'),
      expiresIn: this.config.get<string>('app.jwtRefreshExpiration') || '7d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  private async createSession(userId: string, tokens: TokenPair) {
    await this.prisma.session.create({
      data: {
        userId,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }
}
