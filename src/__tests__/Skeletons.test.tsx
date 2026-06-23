import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArticleSkeleton, QuizSkeleton } from '@/app/(public)/_components/Skeletons';

describe('Skeletons', () => {
  it('ArticleSkeleton renders', () => {
    const { container } = render(<ArticleSkeleton />);
    expect(container.querySelector('.ant-skeleton')).toBeInTheDocument();
  });

  it('QuizSkeleton renders multiple skeleton cards', () => {
    const { container } = render(<QuizSkeleton />);
    const skeletons = container.querySelectorAll('.ant-skeleton');
    expect(skeletons.length).toBeGreaterThanOrEqual(4);
  });
});
