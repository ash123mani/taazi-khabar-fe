'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Quiz } from '@/lib/types';
import QuizQuestionComponent from '@/components/QuizQuestion';
import QuizResult from '@/components/QuizResult';

export default function TakeQuizPage() {
  const params = useParams();
  const id = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api
      .getQuiz(id)
      .then((data) => {
        setQuiz(data);
        const initial: Record<string, string> = {};
        data.questions?.forEach((q: any) => (initial[q.id] = ''));
        setAnswers(initial);
      })
      .catch(() => setError('Failed to load quiz'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelect = (questionId: string, optionKey: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmit = async () => {
    const unanswered = Object.entries(answers).filter(([, v]) => !v);
    if (unanswered.length > 0) {
      if (!confirm(`${unanswered.length} question(s) unanswered. Submit anyway?`)) return;
    }

    setSubmitting(true);
    try {
      const data = await api.submitQuiz(id, answers);
      setQuiz(data);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
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
      <div className="max-w-3xl mx-auto text-center py-12">
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

  if (submitted && quiz.score !== null) {
    return (
      <div className="max-w-3xl mx-auto">
        <QuizResult quiz={quiz} />
        <div className="mt-8 space-y-4">
          {quiz.questions?.map((question, i) => (
            <QuizQuestionComponent
              key={question.id}
              question={question}
              index={i}
              selected={answers[question.id] || null}
              onSelect={() => {}}
              showResults
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{quiz.title || 'Quiz'}</h1>
        <p className="text-sm text-text-muted mt-1">
          {quiz.questions?.length || 0} questions
          {quiz.articles?.length ? ` · ${quiz.articles.length} articles` : ''}
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {quiz.questions?.map((question, i) => (
          <QuizQuestionComponent
            key={question.id}
            question={question}
            index={i}
            selected={answers[question.id] || null}
            onSelect={(optionKey) => handleSelect(question.id, optionKey)}
            showResults={false}
          />
        ))}
      </div>

      <div className="sticky bottom-6 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-accent hover:bg-accent-hover text-surface font-bold px-8 py-3 rounded-full shadow-lg shadow-accent/20 transition-all disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Answers'}
        </button>
      </div>
    </div>
  );
}
