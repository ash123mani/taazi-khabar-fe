import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContentArea from '@/features/news-feed/content-area';
import NewsMasthead from '@/features/news-feed/news-masthead';

const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/lib/api', () => ({
  api: {
    getArticles: vi.fn(),
  },
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: (sel: any) => sel({ accessToken: 'token' }),
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

describe('NewsMasthead', () => {
  it("shows Briefings heading", () => {
    render(<NewsMasthead date="2026-06-21" />);
    expect(screen.getByText('21 June Briefings')).toBeInTheDocument();
  });
});

describe('ContentArea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders articles passed as children', () => {
    const articles = [makeArticle('a1', 'Article 1')];
    render(
      <ContentArea
        date="2026-06-21" source="all" category="all" search=""
        total={1} initialCount={1}
      >
        {articles.map((a) => (
          <div key={a.id} data-testid="article-card">{a.headline}</div>
        ))}
      </ContentArea>,
    );
    expect(screen.getAllByTestId('article-card').length).toBe(1);
  });

  it('shows empty state when no articles', () => {
    render(
      <ContentArea
        date="2026-06-21" source="all" category="all" search=""
        total={0} initialCount={0}
      />,
    );
    expect(screen.getByText(/No articles for/)).toBeInTheDocument();
  });

  it('shows load more button when total > displayed', () => {
    const articles = Array.from({ length: 10 }, (_, i) => makeArticle(`a${i}`, `Article ${i}`));
    render(
      <ContentArea
        date="2026-06-21" source="all" category="all" search=""
        total={15} initialCount={10}
      >
        {articles.map((a) => (
          <div key={a.id} data-testid="article-card">{a.headline}</div>
        ))}
      </ContentArea>,
    );
    expect(screen.getByText(/Load More/)).toBeInTheDocument();
  });
});

describe('SearchControl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('navigates on search', async () => {
    const user = userEvent.setup();
    const { default: SearchControl } = await import('@/features/news-feed/search-control');
    render(<SearchControl date="2026-06-21" source="all" />);
    const input = screen.getByPlaceholderText('Search articles...');
    await user.type(input, 'climate');
    await user.keyboard('{Enter}');
    expect(mockReplace).toHaveBeenCalledWith('/?date=2026-06-21&search=climate');
  });
});
