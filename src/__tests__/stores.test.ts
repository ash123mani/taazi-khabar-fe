import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { User } from '@/lib/types';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isLoading: true });
  });

  it('starts with null user and loading true', () => {
    const s = useAuthStore.getState();
    expect(s.user).toBeNull();
    expect(s.isLoading).toBe(true);
  });

  it('setUser stores user and stops loading', () => {
    const u: User = { id: '1', email: 'a@b.com', name: 'A', is_admin: false };
    useAuthStore.getState().setUser(u);
    const s = useAuthStore.getState();
    expect(s.user).toEqual(u);
    expect(s.isLoading).toBe(false);
  });

  it('setUser(null) clears user', () => {
    useAuthStore.getState().setUser({ id: '1', email: 'a@b.com', name: 'A', is_admin: false });
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('setLoading updates loading state', () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });

  it('logout clears user', () => {
    useAuthStore.getState().setUser({ id: '1', email: 'a@b.com', name: 'A', is_admin: false });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
  });
});

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarCollapsed: false, theme: 'dark' });
  });

  it('starts with defaults', () => {
    const s = useUIStore.getState();
    expect(s.sidebarCollapsed).toBe(false);
    expect(s.theme).toBe('dark');
  });

  it('toggleSidebar flips boolean', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it('toggleTheme switches between dark and light', () => {
    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().theme).toBe('light');
    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().theme).toBe('dark');
  });

  it('setTheme sets specific theme', () => {
    useUIStore.getState().setTheme('light');
    expect(useUIStore.getState().theme).toBe('light');
    useUIStore.getState().setTheme('dark');
    expect(useUIStore.getState().theme).toBe('dark');
  });
});
