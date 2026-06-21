import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsFeedClient from '@/components/NewsFeedClient';

const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/',
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
    const tabs = screen.getAllByRole('tab');
    expect(tabs.some((t) => t.textContent?.includes('All'))).toBe(true);
    expect(tabs.some((t) => t.textContent?.includes('The Hindu'))).toBe(true);
    expect(tabs.some((t) => t.textContent?.includes('Indian Express'))).toBe(true);
    expect(tabs.some((t) => t.textContent?.includes('PIB'))).toBe(true);
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
    const tabs = screen.getAllByRole('tab');
    expect(tabs.some((t) => t.textContent?.includes('Polity'))).toBe(true);
    expect(tabs.some((t) => t.textContent?.includes('Economy'))).toBe(true);
  });

  it('shows load more button when total > displayed', () => {
    const articles = Array.from({ length: 10 }, (_, i) => makeArticle(`a${i}`, `Article ${i}`));
    render(<NewsFeedClient {...defaultProps} initialArticles={articles} initialTotal={15} />);
    expect(screen.getByText(/Load More/)).toBeInTheDocument();
  });

  it('navigates on source tab change', () => {
    render(<NewsFeedClient {...defaultProps} />);
    const tabs = screen.getAllByRole('tab');
    const theHinduTab = tabs.find((t) => t.textContent?.includes('The Hindu'));
    if (theHinduTab) fireEvent.click(theHinduTab);
    expect(mockReplace).toHaveBeenCalledWith('/?date=2026-06-21&source=thehindu');
  });

  it('navigates on category tab change', () => {
    render(
      <NewsFeedClient
        {...defaultProps}
        categories={[{ id: 'c1', name: 'Polity' }]}
      />,
    );
    const tabs = screen.getAllByRole('tab');
    const polityTab = tabs.find((t) => t.textContent?.includes('Polity'));
    if (polityTab) fireEvent.click(polityTab);
    expect(mockReplace).toHaveBeenCalledWith('/?date=2026-06-21&category=c1');
  });

  it('resets category when source changes', () => {
    render(
      <NewsFeedClient
        {...defaultProps}
        category="c1"
        categories={[{ id: 'c1', name: 'Polity' }]}
        counts={{ total: 5, thehindu: 2, indianexpress: 2, pib: 1 }}
      />,
    );
    const tabs = screen.getAllByRole('tab');
    const theHinduTab = tabs.find((t) => t.textContent?.includes('The Hindu'));
    if (theHinduTab) fireEvent.click(theHinduTab);
    expect(mockReplace).toHaveBeenCalledWith(
      '/?date=2026-06-21&source=thehindu',
    );
  });

  it('navigates on search', () => {
    render(<NewsFeedClient {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(input, { target: { value: 'climate' } });
    const searchIcon = input.closest('.ant-input-search')?.querySelector('.ant-input-search-button, .anticon-search');
    if (searchIcon) {
      fireEvent.click(searchIcon);
    } else {
      fireEvent.keyDown(input, { key: 'Enter' });
    }
    expect(mockReplace).toHaveBeenCalledWith('/?date=2026-06-21&search=climate');
  });
});
