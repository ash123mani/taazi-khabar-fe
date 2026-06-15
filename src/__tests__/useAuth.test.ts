import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

const mockUseSession = vi.fn();
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();

vi.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
  signIn: (...args: any[]) => mockSignIn(...args),
  signOut: (...args: any[]) => mockSignOut(...args),
}));

const mockSetUser = vi.fn();
const mockSetLoading = vi.fn();
const mockLogout = vi.fn();
const mockStore = { setUser: mockSetUser, setLoading: mockSetLoading, logout: mockLogout };

vi.mock('@/stores/authStore', () => ({
  useAuthStore: (sel?: any) => sel ? sel(mockStore) : mockStore,
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets loading when status is loading', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'loading' });
    renderHook(() => useAuth());
    expect(mockSetLoading).toHaveBeenCalledWith(true);
  });

  it('sets user when session exists', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: '1', email: 'a@b.com', name: 'A', is_admin: true },
        access_token: 'token123',
      },
      status: 'authenticated',
    });
    renderHook(() => useAuth());
    expect(mockSetUser).toHaveBeenCalledWith(
      { id: '1', email: 'a@b.com', name: 'A', is_admin: true },
      'token123'
    );
  });

  it('calls logout when no session', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    renderHook(() => useAuth());
    expect(mockLogout).toHaveBeenCalled();
  });

  it('returns session and auth helpers', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.loginWithGoogle).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(result.current.status).toBe('unauthenticated');
  });

  it('login calls signIn with credentials provider', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    const { result } = renderHook(() => useAuth());
    result.current.login();
    expect(mockSignIn).toHaveBeenCalledWith('credentials');
  });

  it('loginWithGoogle calls signIn with google', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    const { result } = renderHook(() => useAuth());
    result.current.loginWithGoogle();
    expect(mockSignIn).toHaveBeenCalledWith('google');
  });

  it('logout calls signOut', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    const { result } = renderHook(() => useAuth());
    result.current.logout();
    expect(mockSignOut).toHaveBeenCalled();
  });
});
