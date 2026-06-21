import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboard from '@/app/admin/page';

const mockAdminGetArticles = vi.fn();
const mockGetHistory = vi.fn();

vi.mock('@/lib/api', () => ({
  api: {
    adminGetArticles: (...args: any[]) => mockAdminGetArticles(...args),
    getHistory: (...args: any[]) => mockGetHistory(...args),
  },
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return { ...actual };
});

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', () => {
    mockAdminGetArticles.mockReturnValue(new Promise(() => {}));
    mockGetHistory.mockReturnValue(new Promise(() => {}));
    render(<AdminDashboard />);
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('renders dashboard stats', async () => {
    mockAdminGetArticles.mockResolvedValue({
      articles: [{ id: 'a1', headline: 'Article 1', source: 'thehindu', published_at: '2026-06-15' }],
      total: 1,
    });
    mockGetHistory.mockResolvedValue([]);
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Total Articles')).toBeInTheDocument();
      expect(screen.getByText('Total Quizzes')).toBeInTheDocument();
      expect(screen.getByText('Avg Score')).toBeInTheDocument();
    });
  });

  it('renders recent articles table', async () => {
    mockAdminGetArticles.mockResolvedValue({
      articles: [{ id: 'a1', headline: 'Article 1', source: 'thehindu', published_at: '2026-06-15' }],
      total: 1,
    });
    mockGetHistory.mockResolvedValue([]);
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Recent Articles')).toBeInTheDocument();
    });
  });

  it('renders recent quizzes table', async () => {
    mockAdminGetArticles.mockResolvedValue({ articles: [], total: 0 });
    mockGetHistory.mockResolvedValue({
      quizzes: [{ id: 'q1', score: 8, total_questions: 10, created_at: '2026-06-15T10:00:00Z' }],
    });
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Recent Quizzes')).toBeInTheDocument();
    });
  });

  it('shows stats with values', async () => {
    mockAdminGetArticles.mockResolvedValue({ articles: [], total: 0 });
    mockGetHistory.mockResolvedValue([]);
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('shows article counts in stats cards', async () => {
    mockAdminGetArticles.mockResolvedValue({
      articles: [
        { id: 'a1', headline: 'A1', source: 'thehindu', published_at: '2026-06-15' },
        { id: 'a2', headline: 'A2', source: 'indianexpress', published_at: '2026-06-15' },
      ],
      total: 2,
    });
    mockGetHistory.mockResolvedValue([]);
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});
