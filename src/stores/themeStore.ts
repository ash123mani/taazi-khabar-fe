import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
  setDark: (v: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: true,
      toggle: () =>
        set((s) => {
          const next = !s.isDark;
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
          }
          return { isDark: next };
        }),
      setDark: (v) => {
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', v ? 'dark' : 'light');
        }
        set({ isDark: v });
      },
    }),
    { name: 'taazi-theme' },
  ),
);
