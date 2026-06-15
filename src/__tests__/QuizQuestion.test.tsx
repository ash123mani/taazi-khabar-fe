import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizQuestion from '@/components/QuizQuestion';
import type { QuizQuestion as QuizQuestionType } from '@/lib/types';

const question: QuizQuestionType = {
  id: 'qq1',
  question_text: 'What is the capital of France?',
  options: { A: 'London', B: 'Paris', C: 'Berlin', D: 'Madrid' },
  correct_answer: 'B',
  explanation: 'Paris is the capital of France.',
};

describe('QuizQuestion', () => {
  it('renders question text and index', () => {
    render(<QuizQuestion question={question} index={0} selected={null} onSelect={() => {}} showResults={false} />);
    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<QuizQuestion question={question} index={0} selected={null} onSelect={() => {}} showResults={false} />);
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText('Madrid')).toBeInTheDocument();
  });

  it('calls onSelect when option clicked', () => {
    const onSelect = vi.fn();
    render(<QuizQuestion question={question} index={0} selected={null} onSelect={onSelect} showResults={false} />);
    fireEvent.click(screen.getByText('Paris'));
    expect(onSelect).toHaveBeenCalledWith('B');
  });

  it('shows selected state', () => {
    render(<QuizQuestion question={question} index={0} selected="B" onSelect={() => {}} showResults={false} />);
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('shows correct answer indicator after submission', () => {
    render(<QuizQuestion question={question} index={0} selected="B" onSelect={() => {}} showResults={true} />);
    expect(screen.getByText('✓ Correct')).toBeInTheDocument();
    expect(screen.getByText('Paris is the capital of France.')).toBeInTheDocument();
  });

  it('shows incorrect answer indicator after submission', () => {
    render(<QuizQuestion question={question} index={0} selected="A" onSelect={() => {}} showResults={true} />);
    expect(screen.getByText('✗ Incorrect')).toBeInTheDocument();
  });

  it('does not allow clicking during results', () => {
    const onSelect = vi.fn();
    render(<QuizQuestion question={question} index={0} selected="B" onSelect={onSelect} showResults={true} />);
    fireEvent.click(screen.getByText('London'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('shows checkmark for correct answer', () => {
    render(<QuizQuestion question={question} index={0} selected="B" onSelect={() => {}} showResults={true} />);
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('shows cross for wrong answer', () => {
    render(<QuizQuestion question={question} index={0} selected="A" onSelect={() => {}} showResults={true} />);
    expect(screen.getByText('✗')).toBeInTheDocument();
  });

  it('hides explanation when showResults is false', () => {
    render(<QuizQuestion question={question} index={0} selected={null} onSelect={() => {}} showResults={false} />);
    expect(screen.queryByText('Paris is the capital of France.')).not.toBeInTheDocument();
  });
});
