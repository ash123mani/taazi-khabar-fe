import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuizResult from '@/components/QuizResult';
import type { Quiz } from '@/lib/types';

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return { ...actual };
});

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const quiz: Quiz = {
  id: 'q1',
  title: 'Daily Quiz',
  score: 8,
  total_questions: 10,
  time_taken_sec: 300,
  created_at: '2026-06-15T10:00:00Z',
  articles: [],
  questions: [],
};

describe('QuizResult', () => {
  it('shows percentage and score', () => {
    render(<QuizResult quiz={quiz} />);
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('8 / 10 correct')).toBeInTheDocument();
  });

  it('shows Excellent for >= 80%', () => {
    render(<QuizResult quiz={quiz} />);
    expect(screen.getByText('Excellent!')).toBeInTheDocument();
  });

  it('shows Good Effort for >= 50%', () => {
    const medium: Quiz = { ...quiz, score: 6, total_questions: 10 };
    render(<QuizResult quiz={medium} />);
    expect(screen.getByText('Good Effort')).toBeInTheDocument();
  });

  it('shows Keep Practicing for < 50%', () => {
    const low: Quiz = { ...quiz, score: 3, total_questions: 10 };
    render(<QuizResult quiz={low} />);
    expect(screen.getByText('Keep Practicing')).toBeInTheDocument();
  });

  it('shows time taken', () => {
    render(<QuizResult quiz={quiz} />);
    expect(screen.getByText(/5m 0s/)).toBeInTheDocument();
  });

  it('does not show time taken when null', () => {
    const noTime: Quiz = { ...quiz, time_taken_sec: null };
    render(<QuizResult quiz={noTime} />);
    expect(screen.queryByText(/Time taken/)).not.toBeInTheDocument();
  });

  it('links to review and new quiz', () => {
    render(<QuizResult quiz={quiz} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/history/q1');
    expect(links[1]).toHaveAttribute('href', '/quiz');
  });
});
