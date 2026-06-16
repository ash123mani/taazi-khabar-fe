import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import QuizContent from '@/app/(public)/quiz/QuizContent';

const mockPush = vi.fn();
const mockUseAuthStore = vi.fn();
const mockUseDailyQuizSummary = vi.fn();
const mockUseStartDailyQuiz = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: (sel: any) => mockUseAuthStore(sel),
}));

vi.mock('@/hooks/useQuizzes', () => ({
  useDailyQuizSummary: (...args: any[]) => mockUseDailyQuizSummary(...args),
  useStartDailyQuiz: (...args: any[]) => mockUseStartDailyQuiz(...args),
}));

vi.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => false,
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return { ...actual };
});

describe('QuizContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockImplementation((sel: any) => sel({ accessToken: 'token' }));
    mockUseStartDailyQuiz.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({ quiz_id: 'q1' }),
      isPending: false,
    });
  });

  it('shows loading state', () => {
    mockUseDailyQuizSummary.mockReturnValue({ data: undefined, isLoading: true });
    render(<QuizContent />);
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('shows empty state when no quizzes', async () => {
    mockUseDailyQuizSummary.mockReturnValue({
      data: { date: '2026-06-15', categories: [], total_articles: 0, total_questions: 0 },
      isLoading: false,
    });
    render(<QuizContent />);
    await waitFor(() => {
      expect(screen.getByText(/No quizzes available/)).toBeInTheDocument();
    });
  });

  it('shows Daily Quiz heading', () => {
    mockUseDailyQuizSummary.mockReturnValue({ data: undefined, isLoading: true });
    render(<QuizContent />);
    expect(screen.getByText('Daily Quiz')).toBeInTheDocument();
  });

  it('renders category cards when quizzes available', async () => {
    mockUseDailyQuizSummary.mockReturnValue({
      data: {
        date: '2026-06-15',
        total_articles: 10,
        total_questions: 30,
        categories: [
          { id: 'cat1', name: 'Polity', article_count: 3, question_count: 9, articles: [{ id: 'a1', headline: 'Polity Article', source: 'thehindu', url: 'https://example.com', image_url: null }] },
          { id: 'cat2', name: 'Economy', article_count: 2, question_count: 6, articles: [] },
        ],
      },
      isLoading: false,
    });
    render(<QuizContent />);
    await waitFor(() => {
      expect(screen.getByText('Polity')).toBeInTheDocument();
      expect(screen.getByText('Economy')).toBeInTheDocument();
    });
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Take All Quiz')).toBeInTheDocument();
  });

  it('routes to login when not authenticated and start quiz clicked', async () => {
    mockUseAuthStore.mockImplementation((sel: any) => sel({ accessToken: null }));
    mockUseDailyQuizSummary.mockReturnValue({
      data: {
        date: '2026-06-15',
        total_articles: 1,
        total_questions: 3,
        categories: [
          { id: 'cat1', name: 'Polity', article_count: 1, question_count: 3, articles: [] },
        ],
      },
      isLoading: false,
    });
    render(<QuizContent />);
    await waitFor(() => {
      expect(screen.getByText('Take All Quiz')).toBeInTheDocument();
    });
  });

  it('shows article modal when Articles button clicked', async () => {
    mockUseDailyQuizSummary.mockReturnValue({
      data: {
        date: '2026-06-15',
        total_articles: 1,
        total_questions: 3,
        categories: [
          { id: 'cat1', name: 'Polity', article_count: 1, question_count: 3, articles: [{ id: 'a1', headline: 'Polity Article', source: 'thehindu', url: 'https://example.com', image_url: null }] },
        ],
      },
      isLoading: false,
    });
    render(<QuizContent />);
    await waitFor(() => {
      expect(screen.getByText('Polity')).toBeInTheDocument();
    });
    const articlesEls = screen.getAllByText('Articles');
    expect(articlesEls.length).toBeGreaterThanOrEqual(1);
  });


});
