import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/(public)/register/page';

const mockPush = vi.fn();
const mockRegister = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/lib/api', () => ({
  api: { register: (...args: any[]) => mockRegister(...args) },
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Get started with Taazi Khabar')).toBeInTheDocument();
    expect(screen.getAllByText('Create Account').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('At least 6 characters')).toBeInTheDocument();
  });

  it('renders sign in link', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('calls api.register and redirects on success', async () => {
    mockRegister.mockResolvedValue({ access_token: 'token' });
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getAllByText('Create Account')[1]);
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({ name: 'Test User', email: 'a@b.com', password: 'password123' });
    });
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('shows error on failed registration', async () => {
    mockRegister.mockRejectedValue(new Error('Email already registered'));
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getAllByText('Create Account')[1]);
    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });
  });

  it('parses JSON error detail from API', async () => {
    mockRegister.mockRejectedValue(new Error(JSON.stringify({ detail: 'User already exists' })));
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getAllByText('Create Account')[1]);
    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
  });

  it('shows generic error when parsing fails', async () => {
    mockRegister.mockRejectedValue(new Error('Network error'));
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getAllByText('Create Account')[1]);
    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });
  });
});
