'use client';

import { Quiz } from '@/lib/types';
import Link from 'next/link';

export default function QuizResult({ quiz }: { quiz: Quiz }) {
  const percentage = Math.round(((quiz.score || 0) / quiz.total_questions) * 100);

  return (
    <div className="bg-surface-card border border-surface-border rounded-lg p-6 text-center">
      <div className="text-5xl font-bold text-accent mb-2">{percentage}%</div>
      <p className="text-text-secondary mb-1">
        {quiz.score} / {quiz.total_questions} correct
      </p>
      {quiz.time_taken_sec && (
        <p className="text-sm text-text-muted mb-4">
          Time taken: {Math.floor(quiz.time_taken_sec / 60)}m {quiz.time_taken_sec % 60}s
        </p>
      )}

      <div className="flex items-center justify-center gap-3 mt-4">
        <Link
          href={`/history/${quiz.id}`}
          className="text-sm bg-surface hover:bg-surface-border text-text-secondary px-4 py-2 rounded-lg border border-surface-border transition-colors"
        >
          View Details
        </Link>
        <Link
          href="/quiz"
          className="text-sm bg-accent hover:bg-accent-hover text-surface font-medium px-4 py-2 rounded-lg transition-colors"
        >
          New Quiz
        </Link>
      </div>
    </div>
  );
}
