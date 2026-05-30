import { api } from '@/lib/api';
import type { UserProfile, UserSettings, UserPreference } from '@bondhu/shared-types';

export const userService = {
  async getMe() {
    return api.get<{ profile: UserProfile; settings: UserSettings; preferences: UserPreference }>('users/me');
  },

  async getByHandle(handle: string) {
    return api.get<UserProfile>(`users/${handle}`);
  },

  async updateProfile(data: Partial<UserProfile>) {
    return api.patch<UserProfile>('users/me', data);
  },

  async follow(userId: string) {
    return api.post(`users/${userId}/follow`);
  },

  async unfollow(userId: string) {
    return api.post(`users/${userId}/unfollow`);
  },

  async getFollowers(userId: string, page = 1, limit = 20) {
    return api.get<{ data: UserProfile[] }>(`users/${userId}/followers?page=${page}&limit=${limit}`);
  },

  async getFollowing(userId: string, page = 1, limit = 20) {
    return api.get<{ data: UserProfile[] }>(`users/${userId}/following?page=${page}&limit=${limit}`);
  },

  async mute(userId: string) {
    return api.post(`users/${userId}/mute`);
  },

  async block(userId: string) {
    return api.post(`users/${userId}/block`);
  },

  async search(query: string, page = 1, limit = 20) {
    return api.get<{ data: UserProfile[] }>(`users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },

  async getSettings() {
    return api.get<UserSettings>('users/me/settings');
  },

  async updateSettings(data: Partial<UserSettings>) {
    return api.patch<UserSettings>('users/me/settings', data);
  },

  async getPreferences() {
    return api.get<UserPreference>('users/me/preferences');
  },

  async updatePreferences(data: Partial<UserPreference>) {
    return api.patch<UserPreference>('users/me/preferences', data);
  },
};
