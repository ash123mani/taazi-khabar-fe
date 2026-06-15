import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(public)/login/page';

const mockPush = vi.fn();
const mockSignIn = vi.fn();
const mockUseAuthStore = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('next-auth/react', () => ({
  signIn: (...args: any[]) => mockSignIn(...args),
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: (sel: any) => mockUseAuthStore(sel),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockImplementation((sel: any) => sel({ accessToken: null }));
  });

  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('renders register link', () => {
    render(<LoginPage />);
    expect(screen.getByText('Create one now')).toBeInTheDocument();
  });

  it('redirects if already logged in', () => {
    mockUseAuthStore.mockImplementation((sel: any) => sel({ accessToken: 'token' }));
    render(<LoginPage />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('shows error on failed login', async () => {
    mockSignIn.mockResolvedValue({ error: 'Invalid credentials' });
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  it('redirects on successful login', async () => {
    mockSignIn.mockResolvedValue({ error: null });
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'correct' } });
    fireEvent.click(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('has email validation rule', () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const form = emailInput.closest('form')!;
    fireEvent.submit(form);
  });
});
