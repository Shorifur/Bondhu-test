import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/auth.service';
import { api } from '@/lib/api';
import type { AuthResponse } from '@/services/auth.service';

interface User {
  id: string;
  phoneNumber: string;
  createdAt?: string;
  phoneVerified?: boolean;
  profile?: {
    id: string;
    handle: string;
    displayName: string;
    avatarUrl?: string | null;
    bio?: string | null;
    websiteUrl?: string | null;
    whatsappNumber?: string | null;
    language: string;
    theme: string;
    fontScale: string;
    highContrast: boolean;
    reducedMotion: boolean;
  } | null;
}

interface AuthState {
  user: User | null;
  tokens: { accessToken: string; refreshToken: string; expiresIn: number } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasInitialized: boolean;
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthState['tokens']) => void;
  login: (phone: string, otp: string) => Promise<AuthResponse>;
  bypass: () => void;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,
      hasInitialized: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (tokens) => {
        set({ tokens });
        if (tokens?.accessToken) api.setToken(tokens.accessToken);
      },

      login: async (phone, otp) => {
        const res = await authService.verifyOtp(phone, otp);
        if (res.data) {
          set({ user: res.data.user, tokens: res.data.tokens, isAuthenticated: true });
          api.setToken(res.data.tokens.accessToken);
        }
        return res.data as AuthResponse;
      },

      bypass: () => {
        const mockUser: User = {
          id: '00000000-0000-4000-a000-000000000001',
          phoneNumber: '+8801712345678',
          profile: {
            id: 'dev-profile-001',
            handle: 'dev_tester',
            displayName: 'Dev Tester',
            avatarUrl: null,
            language: 'en',
            theme: 'system',
            fontScale: 'normal',
            highContrast: false,
            reducedMotion: false,
          },
        };
        const mockTokens = {
          accessToken: 'dev-mock-access-token',
          refreshToken: 'dev-mock-refresh-token',
          expiresIn: 999999,
        };
        set({ user: mockUser, tokens: mockTokens, isAuthenticated: true, isLoading: false });
        api.setToken(mockTokens.accessToken);
      },

      logout: async () => {
        try {
          await authService.logout(get().tokens?.accessToken || '');
        } catch {
          // ignore
        }
        set({ user: null, tokens: null, isAuthenticated: false });
        api.setToken(null);
      },

      refresh: async () => {
        const refreshToken = get().tokens?.refreshToken;
        if (!refreshToken) return false;
        try {
          const res = await authService.refreshToken(refreshToken);
          if (res.data) {
            set({ tokens: res.data });
            api.setToken(res.data.accessToken);
            return true;
          }
        } catch {
          set({ user: null, tokens: null, isAuthenticated: false });
          api.setToken(null);
        }
        return false;
      },

      initialize: async () => {
        // Prevent duplicate initialization calls
        if (get().hasInitialized) return;

        set({ isLoading: true });

        try {
          const res = await authService.me();
          if (res.data) {
            set({ user: res.data, isAuthenticated: true, isLoading: false, hasInitialized: true });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false, hasInitialized: true });
            api.setToken(null);
          }
        } catch {
          // API returned 401 or other error — user is not authenticated
          set({ user: null, tokens: null, isAuthenticated: false, isLoading: false, hasInitialized: true });
          api.setToken(null);
        }
      },
    }),
    {
      name: 'bondhu-auth',
      partialize: (state) => ({ user: state.user, tokens: state.tokens, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
