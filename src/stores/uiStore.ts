import { create } from 'zustand'

type ThemeMode = 'light' | 'dark'

interface UIState {
  sidebarCollapsed: boolean
  theme: ThemeMode
  toggleSidebar: () => void
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  theme: 'dark',
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  setTheme: (theme) => set({ theme }),
}))
