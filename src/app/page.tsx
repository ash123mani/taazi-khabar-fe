'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Article } from '@/lib/types';
import ArticleCard from '@/components/ArticleCard';

export default function NewsFeedPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sourceFilter, setSourceFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getArticles(sourceFilter ? { source: sourceFilter } : undefined)
      .then((data) => setArticles(Array.isArray(data) ? data : data.articles || []))
      .catch(() => setError('Failed to load articles'))
      .finally(() => setLoading(false));
  }, [sourceFilter]);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleGenerateQuiz = () => {
    if (selected.size === 0) return;
    const ids = Array.from(selected).join(',');
    router.push(`/quiz?selected=${ids}`);
  };

  const sources = Array.from(new Set(articles.map((a) => a.source)));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">News Feed</h1>
        {selected.size > 0 && (
          <button
            onClick={handleGenerateQuiz}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-surface font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Generate Quiz ({selected.size})
          </button>
        )}
      </div>

      {sources.length > 0 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSourceFilter('')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !sourceFilter
                ? 'bg-accent/10 border-accent text-accent'
                : 'border-surface-border text-text-muted hover:text-text-secondary'
            }`}
          >
            All
          </button>
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => setSourceFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                sourceFilter === s
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-surface-border text-text-muted hover:text-text-secondary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-card border border-surface-border rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-surface-border rounded w-3/4 mb-3" />
              <div className="h-4 bg-surface-border rounded w-full mb-2" />
              <div className="h-4 bg-surface-border rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-400 py-8">{error}</p>
      ) : articles.length === 0 ? (
        <p className="text-center text-text-muted py-8">No articles found.</p>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <div key={article.id} className="relative">
              <label className="absolute top-4 right-4 z-10 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.has(article.id)}
                  onChange={() => toggleSelect(article.id)}
                  className="w-4 h-4 rounded border-surface-border bg-surface-card text-accent focus:ring-accent"
                />
              </label>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}

      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
          <button
            onClick={handleGenerateQuiz}
            className="bg-accent hover:bg-accent-hover text-surface font-bold px-6 py-3 rounded-full shadow-lg shadow-accent/20 transition-all"
          >
            Generate Quiz ({selected.size} articles selected)
          </button>
        </div>
      )}
    </div>
  );
}
