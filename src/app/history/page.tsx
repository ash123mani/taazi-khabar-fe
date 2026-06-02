'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Quiz } from '@/lib/types';
import HistoryCard from '@/components/HistoryCard';

export default function HistoryPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getHistory()
      .then((data) => setQuizzes(Array.isArray(data) ? data : data.quizzes || []))
      .catch(() => setError('Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Quiz History</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-card border border-surface-border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-surface-border rounded w-1/3 mb-3" />
              <div className="h-5 bg-surface-border rounded w-1/2 mb-2" />
              <div className="h-4 bg-surface-border rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-400 py-8">{error}</p>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted mb-4">No quizzes attempted yet.</p>
          <a
            href="/quiz"
            className="text-sm bg-accent hover:bg-accent-hover text-surface px-4 py-2 rounded-lg inline-block"
          >
            Take your first quiz
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <HistoryCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
