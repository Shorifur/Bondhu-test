import { api } from '@/lib/api';
import type { User } from '@bondhu/shared-types';

export interface AuthResponse {
  user: User;
  tokens: { accessToken: string; refreshToken: string; expiresIn: number };
  isNewUser: boolean;
  requiresProfile: boolean;
}

export const authService = {
  async sendOtp(phoneNumber: string) {
    return api.post<{ expiresIn: number; otp?: string }>('auth/otp/send', { phoneNumber });
  },

  async verifyOtp(phoneNumber: string, otp: string) {
    return api.post<AuthResponse>('auth/otp/verify', { phoneNumber, otp });
  },

  async createProfile(data: { legalName: string; handle: string; districtId: number; subDistrictId: number }) {
    return api.post<User>('auth/profile', data);
  },

  async refreshToken(refreshToken: string) {
    return api.post<{ accessToken: string; refreshToken: string; expiresIn: number }>('auth/refresh', { refreshToken });
  },

  async logout(token: string) {
    return api.post('auth/logout', { token });
  },

  async logoutAll() {
    return api.post('auth/logout-all');
  },

  async me() {
    return api.get<User>('auth/me');
  },
};
