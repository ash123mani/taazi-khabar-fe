'use client';

import ArticleCard from './ArticleCard';
import { Article } from '@/lib/types';
import { useState } from 'react';

interface ArticleSelectorProps {
  articles: Article[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}

export default function ArticleSelector({ articles, selected, onToggle }: ArticleSelectorProps) {
  const [search, setSearch] = useState('');

  const filtered = articles.filter(
    (a) =>
      a.headline.toLowerCase().includes(search.toLowerCase()) ||
      (a.gk_summary || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search articles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-surface-card border border-surface-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
      />
      <div className="grid gap-4">
        {filtered.map((article) => (
          <div key={article.id} className="relative">
            <label className="absolute top-4 right-4 z-10 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(article.id)}
                onChange={() => onToggle(article.id)}
                className="w-4 h-4 rounded border-surface-border bg-surface-card text-accent focus:ring-accent"
              />
              <span className="text-xs text-text-muted">Select</span>
            </label>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-8">No articles found.</p>
      )}
    </div>
  );
}
