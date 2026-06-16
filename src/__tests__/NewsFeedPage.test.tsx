import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import NewsFeedPage from '@/app/(public)/page';

const mockGetArticles = vi.fn();
const mockGetCategories = vi.fn();
const mockGetArticleCounts = vi.fn();
const mockUseAuthStore = vi.fn();

vi.mock('@/lib/api', () => ({
  api: {
    getArticles: (...args: any[]) => mockGetArticles(...args),
    getCategories: (...args: any[]) => mockGetCategories(...args),
    getArticleCounts: (...args: any[]) => mockGetArticleCounts(...args),
    toggleBookmark: vi.fn(),
  },
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: (sel: any) => mockUseAuthStore(sel),
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

vi.mock('@/components/Skeletons', () => ({
  ArticleSkeleton: () => <div data-testid="article-skeleton">Skeleton</div>,
}));

describe('NewsFeedPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockImplementation((sel: any) => sel({ accessToken: 'token' }));
    mockGetCategories.mockResolvedValue([]);
    mockGetArticleCounts.mockResolvedValue({});
  });

  it('shows loading skeletons initially', () => {
    mockGetArticles.mockReturnValue(new Promise(() => {}));
    render(<NewsFeedPage />);
    expect(screen.getAllByTestId('article-skeleton').length).toBe(3);
  });

  it('shows GK Gist heading', () => {
    mockGetArticles.mockReturnValue(new Promise(() => {}));
    render(<NewsFeedPage />);
    expect(screen.getByText('GK Gist')).toBeInTheDocument();
  });

  it('renders articles after loading', async () => {
    mockGetArticles.mockResolvedValue([{ id: 'a1', headline: 'Article 1', published_at: '2026-06-15', source: 'thehindu', url: 'https://example.com', image_url: null, key_terms: [], syllabus_tag: null }, { id: 'a2', headline: 'Article 2', published_at: '2026-06-15', source: 'indianexpress', url: 'https://example.com', image_url: null, key_terms: [], syllabus_tag: null }]);
    mockGetArticleCounts.mockResolvedValue({ total: 2, thehindu: 1, indianexpress: 1, pib: 0 });
    render(<NewsFeedPage />);
    await waitFor(() => {
      expect(screen.getAllByTestId('article-card').length).toBe(2);
    });
  });

  it('shows empty state when no articles', async () => {
    mockGetArticles.mockResolvedValue([]);
    render(<NewsFeedPage />);
    await waitFor(() => {
      expect(screen.getByText(/No articles found/)).toBeInTheDocument();
    });
  });

  it('shows error state', async () => {
    mockGetArticles.mockRejectedValue(new Error('Failed'));
    render(<NewsFeedPage />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load articles')).toBeInTheDocument();
    });
  });

  it('shows source filter', async () => {
    mockGetArticles.mockReturnValue(new Promise(() => {}));
    render(<NewsFeedPage />);
    expect(screen.getByText(/All/)).toBeInTheDocument();
  });

  it('shows article count', async () => {
    mockGetArticles.mockResolvedValue([{ id: 'a1', headline: 'A1', published_at: '2026-06-15', source: 'thehindu', url: 'https://example.com', image_url: null, key_terms: [], syllabus_tag: null }]);
    mockGetArticleCounts.mockResolvedValue({ total: 1, thehindu: 1, indianexpress: 0, pib: 0 });
    render(<NewsFeedPage />);
    await waitFor(() => {
      expect(screen.getByText('1 article')).toBeInTheDocument();
    });
  });

  it('renders category filter buttons', async () => {
    mockGetArticles.mockReturnValue(new Promise(() => {}));
    mockGetCategories.mockResolvedValue([{ id: 'c1', name: 'Polity' }, { id: 'c2', name: 'Economy' }]);
    mockGetArticleCounts.mockResolvedValue({ total: 0, thehindu: 0, indianexpress: 0, pib: 0, categories: { Polity: 0, Economy: 0 } });
    render(<NewsFeedPage />);
    await waitFor(() => {
      expect(screen.getByText('Polity (0)')).toBeInTheDocument();
      expect(screen.getByText('Economy (0)')).toBeInTheDocument();
    });
  });

  it('shows load more button when total > displayed', async () => {
    const articles = Array.from({ length: 10 }, (_, i) => ({
      id: `a${i}`, headline: `Article ${i}`, published_at: '2026-06-15',
      source: 'thehindu', url: 'https://example.com', image_url: null,
      key_terms: [], syllabus_tag: null,
    }));
    mockGetArticles.mockResolvedValue({ articles, total: 15 });
    mockGetArticleCounts.mockResolvedValue({ total: 15, thehindu: 15, indianexpress: 0, pib: 0 });
    render(<NewsFeedPage />);
    await waitFor(() => {
      expect(screen.getByText(/Load More/)).toBeInTheDocument();
    });
  });
});
