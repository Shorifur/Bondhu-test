import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../common/services/redis.service';
import crypto from 'crypto';

@Injectable()
export class OtpService {
  private readonly otpTtl = 300; // 5 minutes
  private readonly maxAttempts = 5;

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {}

  generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  async sendOtp(phoneNumber: string): Promise<{ otp: string; expiresIn: number }> {
    const otp = this.generateOtp();
    const key = `otp:${phoneNumber}`;
    const attemptsKey = `otp:attempts:${phoneNumber}`;

    // Store OTP with TTL
    await this.redis.set(key, otp, this.otpTtl);
    await this.redis.set(attemptsKey, 0, this.otpTtl);

    // TODO: Integrate SMS provider (bdtls/grameenphone/etc)
    // For development, return OTP directly
    if (this.config.get('app.nodeEnv') !== 'production') {
      console.log(`[DEV OTP] ${phoneNumber}: ${otp}`);
    }

    return { otp, expiresIn: this.otpTtl };
  }

  async verifyOtp(phoneNumber: string, otp: string): Promise<boolean> {
    const key = `otp:${phoneNumber}`;
    const attemptsKey = `otp:attempts:${phoneNumber}`;

    const storedOtp = await this.redis.get<string>(key);
    if (!storedOtp) {
      return false;
    }

    const attempts = (await this.redis.get<number>(attemptsKey)) || 0;
    if (attempts >= this.maxAttempts) {
      await this.redis.del(key);
      await this.redis.del(attemptsKey);
      return false;
    }

    if (storedOtp !== otp) {
      await this.redis.set(attemptsKey, attempts + 1, this.otpTtl);
      return false;
    }

    // Success - clear OTP
    await this.redis.del(key);
    await this.redis.del(attemptsKey);
    return true;
  }

  async canResend(phoneNumber: string): Promise<{ canResend: boolean; waitSeconds: number }> {
    const key = `otp:${phoneNumber}`;
    const ttl = await this.redis.getClient().ttl(this.redis['prefix'](key));
    if (ttl > 0) {
      return { canResend: false, waitSeconds: ttl };
    }
    return { canResend: true, waitSeconds: 0 };
  }
}
