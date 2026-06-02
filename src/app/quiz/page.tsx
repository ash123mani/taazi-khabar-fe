'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Article } from '@/lib/types';
import ArticleSelector from '@/components/ArticleSelector';

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get('selected')?.split(',').filter(Boolean) || [];

  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(preselected));
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getArticles()
      .then((data) => setArticles(Array.isArray(data) ? data : data.articles || []))
      .catch(() => setError('Failed to load articles'))
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleGenerate = async () => {
    if (selected.size === 0) return;
    setGenerating(true);
    setError('');
    try {
      const data = await api.generateQuiz(Array.from(selected), numQuestions);
      router.push(`/quiz/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz');
      setGenerating(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Generate Quiz</h1>

      <div className="bg-surface-card border border-surface-border rounded-lg p-5 mb-6">
        <label className="block text-sm text-text-secondary mb-2">Number of Questions</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={5}
            max={15}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="flex-1 accent-accent"
          />
          <span className="text-text-primary font-bold text-lg w-8 text-right">{numQuestions}</span>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {selected.size} article{selected.size !== 1 ? 's' : ''} selected
        </p>
        {selected.size > 0 && (
          <button
            onClick={() => setSelected(new Set())}
            className="text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-card border border-surface-border rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-surface-border rounded w-3/4 mb-3" />
              <div className="h-4 bg-surface-border rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <ArticleSelector articles={articles} selected={selected} onToggle={toggleSelect} />
      )}

      {selected.size > 0 && (
        <div className="sticky bottom-6 flex justify-center mt-6">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-accent hover:bg-accent-hover text-surface font-bold px-8 py-3 rounded-full shadow-lg shadow-accent/20 transition-all disabled:opacity-50"
          >
            {generating ? 'Generating...' : `Generate Quiz (${selected.size} articles)`}
          </button>
        </div>
      )}
    </div>
  );
}
