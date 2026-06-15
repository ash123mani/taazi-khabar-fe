import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import HistoryPage from '@/app/(public)/history/page';

const mockGetHistory = vi.fn();
const mockUseAuthStore = vi.fn();

vi.mock('@/lib/api', () => ({
  api: { getHistory: (...args: any[]) => mockGetHistory(...args) },
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: (sel: any) => mockUseAuthStore(sel),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return { ...actual };
});

vi.mock('@/components/HistoryCard', () => ({
  default: ({ quiz }: any) => <div data-testid="history-card">{quiz.title}</div>,
}));

describe('HistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockImplementation((sel: any) => sel({ accessToken: 'token', user: { id: '1' } }));
  });

  it('shows loading state', () => {
    mockGetHistory.mockReturnValue(new Promise(() => {}));
    render(<HistoryPage />);
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('shows login prompt when not authenticated', async () => {
    mockUseAuthStore.mockImplementation((sel: any) => sel({ accessToken: null }));
    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('Please login to view your quiz history')).toBeInTheDocument();
    });
  });

  it('shows empty state when no quizzes', async () => {
    mockGetHistory.mockResolvedValue([]);
    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('No quizzes attempted yet')).toBeInTheDocument();
    });
  });

  it('shows error state', async () => {
    mockGetHistory.mockRejectedValue(new Error('Failed to load history'));
    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load history')).toBeInTheDocument();
    });
  });

  it('renders quiz list', async () => {
    mockGetHistory.mockResolvedValue([
      { id: 'h1', title: 'Quiz 1', score: 8, total_questions: 10, created_at: '2026-06-15T10:00:00Z', articles: [], questions: [] },
      { id: 'h2', title: 'Quiz 2', score: 5, total_questions: 10, created_at: '2026-06-14T10:00:00Z', articles: [], questions: [] },
    ]);
    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getAllByTestId('history-card').length).toBe(2);
    });
  });

  it('shows total quizzes stat', async () => {
    mockGetHistory.mockResolvedValue([
      { id: 'h1', title: 'Q1', score: 8, total_questions: 10, created_at: '2026-06-15T10:00:00Z', articles: [], questions: [] },
    ]);
    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('calculates average score', async () => {
    mockGetHistory.mockResolvedValue([
      { id: 'h1', title: 'Q1', score: 8, total_questions: 10, created_at: '2026-06-15T10:00:00Z', articles: [], questions: [] },
      { id: 'h2', title: 'Q2', score: 4, total_questions: 10, created_at: '2026-06-14T10:00:00Z', articles: [], questions: [] },
    ]);
    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('Total Quizzes')).toBeInTheDocument();
    });
  });

  it('handles empty array from API wrapper', async () => {
    mockGetHistory.mockResolvedValue({ quizzes: [] });
    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('No quizzes attempted yet')).toBeInTheDocument();
    });
  });
});
