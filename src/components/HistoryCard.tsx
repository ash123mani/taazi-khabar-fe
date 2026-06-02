'use client';

import { Quiz } from '@/lib/types';
import Link from 'next/link';

export default function HistoryCard({ quiz }: { quiz: Quiz }) {
  const percentage = quiz.score !== null
    ? Math.round((quiz.score / quiz.total_questions) * 100)
    : null;

  return (
    <Link href={`/history/${quiz.id}`}>
      <div className="bg-surface-card border border-surface-border rounded-lg p-4 hover:border-accent/30 transition-colors cursor-pointer">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-text-muted">
            {new Date(quiz.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {percentage !== null && (
            <span
              className={`text-sm font-bold ${
                percentage >= 60 ? 'text-green-400' : percentage >= 40 ? 'text-amber-400' : 'text-red-400'
              }`}
            >
              {percentage}%
            </span>
          )}
        </div>
        <p className="text-text-primary font-medium mb-1">{quiz.title || 'Untitled Quiz'}</p>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>{quiz.total_questions} questions</span>
          {quiz.score !== null && (
            <span>
              {quiz.score}/{quiz.total_questions} correct
            </span>
          )}
          <span>{quiz.articles?.length || 0} articles</span>
        </div>
      </div>
    </Link>
  );
}
