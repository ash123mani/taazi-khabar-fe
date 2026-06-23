import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuizContent from '@/app/(public)/quiz/_components/QuizContent';
import React from 'react';

const mockPush = vi.fn();
const mockStartDailyQuiz = vi.fn();
const mockUseAuthStore = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
  usePathname: () => '/quiz',
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: (sel: any) => mockUseAuthStore(sel),
}));

vi.mock('@/lib/api', () => ({
  api: { startDailyQuiz: (...args: any[]) => mockStartDailyQuiz(...args) },
}));

vi.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => false,
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return { ...actual };
});

const defaultSummary = {
  date: '2026-06-15',
  categories: [],
  total_articles: 0,
  total_questions: 0,
};

const categorySummary = {
  date: '2026-06-15',
  total_articles: 10,
  total_questions: 30,
  categories: [
    {
      id: 'cat1',
      name: 'Polity',
      article_count: 3,
      question_count: 9,
      articles: [
        { id: 'a1', headline: 'Polity Article', source: 'thehindu', url: 'https://example.com', image_url: null },
      ],
    },
    { id: 'cat2', name: 'Economy', article_count: 2, question_count: 6, articles: [] },
  ],
};

describe('QuizContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockImplementation((sel: any) => sel({ accessToken: 'token' }));
    mockStartDailyQuiz.mockResolvedValue({ quiz_id: 'q1' });
  });

  it('shows empty state when no quizzes', () => {
    render(<QuizContent date="2026-06-15" initialSummary={defaultSummary} />);
    expect(screen.getByText(/No quizzes available/)).toBeInTheDocument();
  });

  it('shows Daily Quiz heading', () => {
    render(<QuizContent date="2026-06-15" initialSummary={defaultSummary} />);
    expect(screen.getByText('Quiz — 15 June 2026')).toBeInTheDocument();
  });

  it('renders category cards when quizzes available', () => {
    render(<QuizContent date="2026-06-15" initialSummary={categorySummary} />);
    expect(screen.getByText('Polity')).toBeInTheDocument();
    expect(screen.getByText('Economy')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Take All')).toBeInTheDocument();
  });

  it('routes to login when not authenticated and start quiz clicked', async () => {
    mockUseAuthStore.mockImplementation((sel: any) => sel({ accessToken: null }));
    render(<QuizContent date="2026-06-15" initialSummary={categorySummary} />);
    await userEvent.click(screen.getByText('Take All'));
    expect(mockPush).toHaveBeenCalledWith('/login?callbackUrl=/quiz');
  });

  it('shows article modal when Articles button clicked', async () => {
    render(<QuizContent date="2026-06-15" initialSummary={categorySummary} />);
    const articleBtns = screen.getAllByText('Articles');
    await userEvent.click(articleBtns[1]);
    await waitFor(() => {
      expect(screen.getByText('Polity Article')).toBeInTheDocument();
    });
  });
});
