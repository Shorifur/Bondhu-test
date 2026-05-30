import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SheetState {
  isOpen: boolean;
  data?: Record<string, unknown>;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UIState {
  theme: 'light' | 'dark' | 'system';
  fontScale: 'XS' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'XL';
  language: 'bn' | 'en' | 'bng';
  highContrast: boolean;
  reducedMotion: boolean;
  activeSheet: string | null;
  sheets: Record<string, SheetState>;
  bottomNavIndex: number;
  toasts: Toast[];
  setTheme: (theme: UIState['theme']) => void;
  setFontScale: (scale: UIState['fontScale']) => void;
  setLanguage: (lang: UIState['language']) => void;
  setHighContrast: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  openSheet: (name: string, data?: Record<string, unknown>) => void;
  closeSheet: (name?: string) => void;
  setBottomNavIndex: (index: number) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      fontScale: 'MEDIUM',
      language: 'bn',
      highContrast: false,
      reducedMotion: false,
      activeSheet: null,
      sheets: {},
      bottomNavIndex: 0,
      toasts: [],

      setTheme: (theme) => set({ theme }),
      setFontScale: (fontScale) => set({ fontScale }),
      setLanguage: (language) => set({ language }),
      setHighContrast: (highContrast) => set({ highContrast }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),

      openSheet: (name, data) =>
        set((state) => ({
          activeSheet: name,
          sheets: { ...state.sheets, [name]: { isOpen: true, data } },
        })),

      closeSheet: (name) =>
        set((state) => ({
          activeSheet: name ? (state.activeSheet === name ? null : state.activeSheet) : null,
          sheets: name
            ? { ...state.sheets, [name]: { isOpen: false } }
            : Object.fromEntries(Object.entries(state.sheets).map(([k, v]) => [k, { ...v, isOpen: false }])),
        })),

      setBottomNavIndex: (bottomNavIndex) => set({ bottomNavIndex }),

      addToast: (message, type = 'success') =>
        set((state) => ({
          toasts: [...state.toasts, { id: Math.random().toString(36).slice(2), message, type }],
        })),

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'bondhu-ui',
      partialize: (state) => ({
        theme: state.theme,
        fontScale: state.fontScale,
        language: state.language,
        highContrast: state.highContrast,
        reducedMotion: state.reducedMotion,
      }),
    },
  ),
);
