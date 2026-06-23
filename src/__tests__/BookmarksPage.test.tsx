import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import BookmarksPage from '@/app/(public)/bookmarks/page';

const mockGetBookmarkedArticles = vi.fn();
const mockUseAuthStore = vi.fn();

vi.mock('@/lib/api', () => ({
  api: { getBookmarkedArticles: (...args: any[]) => mockGetBookmarkedArticles(...args) },
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: (sel: any) => mockUseAuthStore(sel),
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return { ...actual };
});

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@/app/(public)/_components/ArticleCard', () => ({
  default: ({ article }: any) => <div data-testid="article-card">{article.headline}</div>,
}));

describe('BookmarksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockImplementation((sel: any) => sel({ accessToken: 'token' }));
  });

  it('shows login prompt when not authenticated', () => {
    mockUseAuthStore.mockImplementation((sel: any) => sel({ accessToken: null }));
    render(<BookmarksPage />);
    expect(screen.getByText('Please login to view bookmarks')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockGetBookmarkedArticles.mockReturnValue(new Promise(() => {}));
    const { container } = render(<BookmarksPage />);
    expect(container.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('shows empty state', async () => {
    mockGetBookmarkedArticles.mockResolvedValue([]);
    render(<BookmarksPage />);
    await waitFor(() => {
      expect(screen.getByText('No bookmarks yet')).toBeInTheDocument();
    });
  });

  it('renders bookmarked articles', async () => {
    mockGetBookmarkedArticles.mockResolvedValue([
      {
        id: 'a1',
        headline: 'Bookmarked Article',
        published_at: '2026-06-15',
        source: 'thehindu',
        url: 'https://example.com',
        image_url: null,
        key_terms: [],
        syllabus_tag: null,
      },
    ]);
    render(<BookmarksPage />);
    await waitFor(() => {
      expect(screen.getByText('Clippings')).toBeInTheDocument();
    });
  });
});
