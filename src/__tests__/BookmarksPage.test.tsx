import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

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

describe('BookmarksList', () => {
  it('shows empty state', async () => {
    const { default: BookmarksList } = await import('@/app/(public)/bookmarks/_components/BookmarksList');
    render(<BookmarksList articles={[]} />);
    expect(screen.getByText('No bookmarks yet')).toBeInTheDocument();
  });

  it('renders bookmarked articles', async () => {
    const { default: BookmarksList } = await import('@/app/(public)/bookmarks/_components/BookmarksList');
    const articles = [
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
    ];
    render(<BookmarksList articles={articles} />);
    expect(screen.getByText('Clippings')).toBeInTheDocument();
    expect(screen.getByText('Bookmarked Article')).toBeInTheDocument();
  });
});
