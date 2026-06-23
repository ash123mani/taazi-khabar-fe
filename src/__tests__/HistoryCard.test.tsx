import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HistoryCard from '@/app/(public)/history/_components/HistoryCard';
import type { Quiz } from '@/lib/types';

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return { ...actual };
});

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const baseQuiz: Quiz = {
  id: 'q1',
  title: 'Daily Quiz - 15-06-2026',
  score: 8,
  total_questions: 10,
  time_taken_sec: 300,
  created_at: '2026-06-15T10:00:00Z',
  articles: [{ id: 'a1' }] as any,
  questions: [],
};

describe('HistoryCard', () => {
  it('renders quiz title and percentage', () => {
    render(<HistoryCard quiz={baseQuiz} />);
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('Daily Quiz - 15-06-2026')).toBeInTheDocument();
  });

  it('shows question count', () => {
    render(<HistoryCard quiz={baseQuiz} />);
    expect(screen.getByText('10 questions')).toBeInTheDocument();
  });

  it('shows article count when articles exist', () => {
    render(<HistoryCard quiz={baseQuiz} />);
    expect(screen.getByText('1 articles')).toBeInTheDocument();
  });

  it('links to history detail page', () => {
    render(<HistoryCard quiz={baseQuiz} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/history/q1');
  });

  it('shows green color for score >= 60', () => {
    const highScore: Quiz = { ...baseQuiz, score: 6, total_questions: 10 };
    render(<HistoryCard quiz={highScore} />);
    const tag = screen.getByText('60%');
    expect(tag).toBeInTheDocument();
  });

  it('shows red color for score < 30', () => {
    const lowScore: Quiz = { ...baseQuiz, score: 2, total_questions: 10 };
    render(<HistoryCard quiz={lowScore} />);
    const tag = screen.getByText('20%');
    expect(tag).toBeInTheDocument();
  });

  it('handles null score', () => {
    const noScore: Quiz = { ...baseQuiz, score: null, total_questions: 10 };
    render(<HistoryCard quiz={noScore} />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('renders date in DD-MM-YYYY format', () => {
    render(<HistoryCard quiz={baseQuiz} />);
    expect(screen.getByText('15-06-2026')).toBeInTheDocument();
  });

  it('does not show article count when articles is empty', () => {
    const noArticles: Quiz = { ...baseQuiz, articles: [] as any };
    render(<HistoryCard quiz={noArticles} />);
    expect(screen.queryByText('articles')).not.toBeInTheDocument();
  });
});
