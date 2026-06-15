import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useThemeStore } from '@/stores/themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ isDark: true });
  });

  it('starts with isDark true', () => {
    expect(useThemeStore.getState().isDark).toBe(true);
  });

  it('toggle flips isDark and sets data-theme', () => {
    const setAttribute = vi.fn();
    document.documentElement.setAttribute = setAttribute;
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().isDark).toBe(false);
    expect(setAttribute).toHaveBeenCalledWith('data-theme', 'light');

    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().isDark).toBe(true);
    expect(setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });

  it('setDark sets specific value and data-theme', () => {
    const setAttribute = vi.fn();
    document.documentElement.setAttribute = setAttribute;
    useThemeStore.getState().setDark(false);
    expect(useThemeStore.getState().isDark).toBe(false);
    expect(setAttribute).toHaveBeenCalledWith('data-theme', 'light');

    useThemeStore.getState().setDark(true);
    expect(useThemeStore.getState().isDark).toBe(true);
    expect(setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });
});
