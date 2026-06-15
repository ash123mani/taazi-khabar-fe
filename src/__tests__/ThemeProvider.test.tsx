import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ThemeProvider from '@/components/ThemeProvider';

const mockUseThemeStore = vi.fn();
vi.mock('@/stores/themeStore', () => ({
  useThemeStore: (sel: any) => mockUseThemeStore(sel),
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return { ...actual };
});

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseThemeStore.mockImplementation((sel: any) => sel({ isDark: true, setDark: vi.fn() }));
  });

  it('renders children', () => {
    render(<ThemeProvider><div>Child content</div></ThemeProvider>);
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('sets data-theme on mount', () => {
    const setAttribute = vi.fn();
    document.documentElement.setAttribute = setAttribute;
    mockUseThemeStore.mockImplementation((sel: any) => sel({ isDark: true, setDark: vi.fn() }));
    render(<ThemeProvider><div>Content</div></ThemeProvider>);
    expect(setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });

  it('calls setDark on mount', () => {
    const setDark = vi.fn();
    mockUseThemeStore.mockImplementation((sel: any) => sel({ isDark: true, setDark }));
    render(<ThemeProvider><div>Content</div></ThemeProvider>);
    expect(setDark).toHaveBeenCalledWith(true);
  });
});
