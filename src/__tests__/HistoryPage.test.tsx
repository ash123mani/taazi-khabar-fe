import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return { ...actual };
});

describe('HistoryCard', () => {
  it('renders quiz title and score', async () => {
    const { default: HistoryCard } = await import('@/app/(public)/history/_components/HistoryCard');
    render(
      <HistoryCard
        quiz={{
          id: 'h1',
          title: 'Daily Quiz',
          score: 8,
          total_questions: 10,
          created_at: '2026-06-15T10:00:00Z',
          articles: [],
          questions: [],
        }}
      />,
    );
    expect(screen.getByText('Daily Quiz')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('10 questions')).toBeInTheDocument();
  });

  it('handles null score', async () => {
    const { default: HistoryCard } = await import('@/app/(public)/history/_components/HistoryCard');
    render(
      <HistoryCard
        quiz={{
          id: 'h2',
          title: 'Incomplete Quiz',
          score: null,
          total_questions: 10,
          created_at: '2026-06-14T10:00:00Z',
          articles: [],
          questions: [],
        }}
      />,
    );
    expect(screen.getByText('Incomplete Quiz')).toBeInTheDocument();
    expect(screen.getByText('10 questions')).toBeInTheDocument();
  });

  it('shows article count', async () => {
    const { default: HistoryCard } = await import('@/app/(public)/history/_components/HistoryCard');
    render(
      <HistoryCard
        quiz={{
          id: 'h3',
          title: 'Quiz with Articles',
          score: 5,
          total_questions: 10,
          created_at: '2026-06-14T10:00:00Z',
          articles: [{ id: 'a1' }, { id: 'a2' }],
          questions: [],
        }}
      />,
    );
    expect(screen.getByText('2 articles')).toBeInTheDocument();
  });
});
