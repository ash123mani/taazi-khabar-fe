'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Quiz } from '@/lib/types';
import ArticleCard from '@/components/ArticleCard';
import QuizQuestionComponent from '@/components/QuizQuestion';

export default function HistoryDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api
      .getHistoryDetail(id)
      .then(setQuiz)
      .catch(() => setError('Failed to load quiz details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-8 bg-surface-border rounded w-48 animate-pulse mb-6" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-card border border-surface-border rounded-lg p-5 animate-pulse">
            <div className="h-4 bg-surface-border rounded w-1/4 mb-3" />
            <div className="h-5 bg-surface-border rounded w-3/4 mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-12 bg-surface-border rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm bg-accent hover:bg-accent-hover text-surface px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!quiz) return null;

  const percentage = quiz.score !== null
    ? Math.round((quiz.score / quiz.total_questions) * 100)
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface-card border border-surface-border rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          {quiz.title || 'Quiz Details'}
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-text-muted mb-1">Score</p>
            <p className="text-lg font-bold text-accent">
              {quiz.score}/{quiz.total_questions}
              {percentage !== null && <span className="text-sm ml-1">({percentage}%)</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Date</p>
            <p className="text-sm text-text-primary">
              {new Date(quiz.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Time Taken</p>
            <p className="text-sm text-text-primary">
              {quiz.time_taken_sec
                ? `${Math.floor(quiz.time_taken_sec / 60)}m ${quiz.time_taken_sec % 60}s`
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Articles</p>
            <p className="text-sm text-text-primary">{quiz.articles?.length || 0}</p>
          </div>
        </div>
      </div>

      {quiz.articles && quiz.articles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Linked Articles</h2>
          <div className="grid gap-4">
            {quiz.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Questions & Answers</h2>
        <div className="space-y-4">
          {quiz.questions?.map((question, i) => (
            <QuizQuestionComponent
              key={question.id}
              question={question}
              index={i}
              selected={question.correct_answer || null}
              onSelect={() => {}}
              showResults
            />
          ))}
        </div>
      </div>
    </div>
  );
}
