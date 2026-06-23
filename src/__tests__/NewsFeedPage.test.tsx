import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsFeedClient from '@/components/NewsFeedClient';

const mockReplace = vi.fn();
const mockPrefetch = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, prefetch: mockPrefetch }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useTransition: () => [false, (fn: () => void) => fn()],
}));

vi.mock('@/lib/api', () => ({
  api: {
    getArticles: vi.fn(),
    getArticleCounts: vi.fn(),
    toggleBookmark: vi.fn(),
  },
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: (sel: any) => sel({ accessToken: 'token' }),
}));

vi.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => false,
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return { ...actual };
});

vi.mock('@/components/ArticleCard', () => ({
  default: ({ article }: any) => <div data-testid="article-card">{article.headline}</div>,
}));

const makeArticle = (id: string, headline: string) => ({
  id,
  headline,
  published_at: '2026-06-15',
  source: 'thehindu',
  url: 'https://example.com',
  image_url: null,
  key_terms: [],
  syllabus_tag: null,
});

const defaultProps = {
  date: '2026-06-21',
  initialArticles: [] as any[],
  initialTotal: 0,
  categories: [] as { id: string; name: string }[],
  counts: { total: 0, thehindu: 0, indianexpress: 0, pib: 0 },
  filteredCounts: { total: 0, thehindu: 0, indianexpress: 0, pib: 0 },
  source: 'all',
  category: 'all',
  search: '',
};

describe('NewsFeedClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Briefings masthead", () => {
    render(<NewsFeedClient {...defaultProps} />);
    expect(screen.getByText('21 June Briefings')).toBeInTheDocument();
  });

  it('renders articles from initial data', () => {
    const articles = [makeArticle('a1', 'Article 1'), makeArticle('a2', 'Article 2')];
    render(<NewsFeedClient {...defaultProps} initialArticles={articles} initialTotal={2} />);
    expect(screen.getAllByTestId('article-card').length).toBe(2);
  });

  it('shows empty state when no articles', () => {
    render(<NewsFeedClient {...defaultProps} />);
    expect(screen.getByText(/No articles for/)).toBeInTheDocument();
  });

  it('shows source tabs', () => {
    render(<NewsFeedClient {...defaultProps} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('The Hindu')).toBeInTheDocument();
    expect(screen.getByText('Indian Express')).toBeInTheDocument();
    expect(screen.getByText('PIB')).toBeInTheDocument();
  });

  it('shows source counts', () => {
    render(
      <NewsFeedClient
        {...defaultProps}
        counts={{ total: 5, thehindu: 2, indianexpress: 2, pib: 1 }}
      />,
    );
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
  });

  it('renders category filter tabs', () => {
    render(
      <NewsFeedClient
        {...defaultProps}
        categories={[
          { id: 'c1', name: 'Polity' },
          { id: 'c2', name: 'Economy' },
        ]}
      />,
    );
    expect(screen.getByText('Polity')).toBeInTheDocument();
    expect(screen.getByText('Economy')).toBeInTheDocument();
  });

  it('shows load more button when total > displayed', () => {
    const articles = Array.from({ length: 10 }, (_, i) => makeArticle(`a${i}`, `Article ${i}`));
    render(<NewsFeedClient {...defaultProps} initialArticles={articles} initialTotal={15} />);
    expect(screen.getByText(/Load More/)).toBeInTheDocument();
  });

  it('navigates on search', async () => {
    const user = userEvent.setup();
    render(<NewsFeedClient {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search articles...');
    await user.type(input, 'climate');
    await user.keyboard('{Enter}');
    expect(mockReplace).toHaveBeenCalledWith('/?date=2026-06-21&search=climate');
  });
});
