import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ArticleCard from '@/app/(public)/_components/ArticleCard';
import type { Article } from '@/lib/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/image', () => ({
  default: (props: any) => {
    const { fill, ...rest } = props;
    return <img {...rest} style={{ ...rest.style, objectFit: 'cover' }} />;
  },
}));

const mockToggleBookmark = vi.fn();
vi.mock('@/lib/api', () => ({
  api: { toggleBookmark: (...args: any[]) => mockToggleBookmark(...args) },
}));

const { mockUseAuthStore } = vi.hoisted(() => ({
  mockUseAuthStore: vi.fn(),
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

const article: Article = {
  id: 'a1',
  source: 'thehindu',
  headline: 'Test Article Headline',
  url: 'https://example.com',
  body_text: null,
  published_at: '2026-06-15T10:00:00Z',
  gk_summary: '### GK Summary\n\nTest summary content',
  key_terms: ['Term1', 'Term2'],
  syllabus_tag: 'Polity',
  image_url: 'https://example.com/img.jpg',
  is_bookmarked: false,
};

describe('ArticleCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockImplementation((sel: any) => sel({ user: { id: '1' }, accessToken: 'token' }));
  });

  it('renders headline and date', () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByText('Test Article Headline')).toBeInTheDocument();
    expect(screen.getByText('15-06-2026')).toBeInTheDocument();
  });

  it('renders image', () => {
    render(<ArticleCard article={article} />);
    const img = screen.getByAltText('');
    expect(img).toHaveAttribute('src', 'https://example.com/img.jpg');
  });

  it('shows syllabus tag', () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByText('Polity')).toBeInTheDocument();
  });

  it('does not show key terms', () => {
    render(<ArticleCard article={article} />);
    expect(screen.queryByText('Term1')).not.toBeInTheDocument();
  });

  it('calls toggleBookmark on bookmark click', async () => {
    mockToggleBookmark.mockResolvedValue({ bookmarked: true });
    const { container } = render(<ArticleCard article={article} />);
    const btn = container.querySelector('button')!;
    fireEvent.click(btn);
    await waitFor(() => {
      expect(mockToggleBookmark).toHaveBeenCalledWith('a1');
    });
  });

  it('handles bookmark error gracefully', async () => {
    mockToggleBookmark.mockRejectedValue(new Error('Failed'));
    const { container } = render(<ArticleCard article={article} />);
    const btn = container.querySelector('button')!;
    fireEvent.click(btn);
    await waitFor(() => {
      expect(mockToggleBookmark).toHaveBeenCalledWith('a1');
    });
  });

  it('hides summary when no gk_summary', () => {
    render(<ArticleCard article={{ ...article, gk_summary: null }} />);
    expect(screen.queryByText('Summary')).not.toBeInTheDocument();
  });
});
