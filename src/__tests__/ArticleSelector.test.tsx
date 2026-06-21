import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ArticleSelector from '@/components/ArticleSelector';
import type { Article } from '@/lib/types';

vi.mock('@/lib/api', () => ({
  api: { toggleBookmark: vi.fn() },
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: (sel: any) => sel({ user: null, accessToken: null }),
}));

vi.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => false,
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return { ...actual };
});

const articles: Article[] = [
  {
    id: 'a1',
    headline: 'Polity Update',
    gk_summary: 'Polity summary',
    published_at: '2026-06-15',
    source: 'thehindu',
    url: 'https://example.com/1',
    image_url: null,
    key_terms: [],
    syllabus_tag: null,
    is_bookmarked: false,
  },
  {
    id: 'a2',
    headline: 'Economy News',
    gk_summary: 'Economy summary',
    published_at: '2026-06-15',
    source: 'indianexpress',
    url: 'https://example.com/2',
    image_url: null,
    key_terms: [],
    syllabus_tag: null,
    is_bookmarked: false,
  },
  {
    id: 'a3',
    headline: 'Science Breakthrough',
    gk_summary: 'Science summary',
    published_at: '2026-06-15',
    source: 'thehindu',
    url: 'https://example.com/3',
    image_url: null,
    key_terms: [],
    syllabus_tag: null,
    is_bookmarked: false,
  },
];

describe('ArticleSelector', () => {
  it('renders search input', () => {
    render(<ArticleSelector articles={articles} selected={new Set()} onToggle={() => {}} />);
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
  });

  it('renders all articles by default', () => {
    render(<ArticleSelector articles={articles} selected={new Set()} onToggle={() => {}} />);
    expect(screen.getByText('Polity Update')).toBeInTheDocument();
    expect(screen.getByText('Economy News')).toBeInTheDocument();
    expect(screen.getByText('Science Breakthrough')).toBeInTheDocument();
  });

  it('filters articles by headline', () => {
    render(<ArticleSelector articles={articles} selected={new Set()} onToggle={() => {}} />);
    const search = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(search, { target: { value: 'Polity' } });
    expect(screen.getByText('Polity Update')).toBeInTheDocument();
    expect(screen.queryByText('Economy News')).not.toBeInTheDocument();
  });

  it('filters articles by summary content', () => {
    render(<ArticleSelector articles={articles} selected={new Set()} onToggle={() => {}} />);
    const search = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(search, { target: { value: 'Economy' } });
    expect(screen.getByText('Economy News')).toBeInTheDocument();
    expect(screen.queryByText('Science Breakthrough')).not.toBeInTheDocument();
  });

  it('shows empty state when no match', () => {
    render(<ArticleSelector articles={articles} selected={new Set()} onToggle={() => {}} />);
    const search = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(search, { target: { value: 'zzzznonexistent' } });
    expect(screen.getByText('No articles found')).toBeInTheDocument();
  });

  it('shows checkbox for each article', () => {
    render(<ArticleSelector articles={articles} selected={new Set()} onToggle={() => {}} />);
    const checkboxes = screen.getAllByText('Select');
    expect(checkboxes.length).toBe(3);
  });

  it('calls onToggle when checkbox clicked', () => {
    const onToggle = vi.fn();
    render(<ArticleSelector articles={articles} selected={new Set()} onToggle={onToggle} />);
    const checkboxes = screen.getAllByText('Select');
    fireEvent.click(checkboxes[0]);
    expect(onToggle).toHaveBeenCalledWith('a1');
  });
});
