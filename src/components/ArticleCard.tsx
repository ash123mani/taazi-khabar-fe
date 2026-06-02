'use client';

import SyllabusTag from './SyllabusTag';
import { Article } from '@/lib/types';

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-lg p-4 hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary font-semibold text-base hover:text-accent transition-colors line-clamp-2"
          >
            {article.headline}
          </a>
          {article.gk_summary && (
            <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-3">
              {article.gk_summary}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {article.syllabus_tag && <SyllabusTag tag={article.syllabus_tag} />}
        {article.key_terms?.map((term) => (
          <span
            key={term}
            className="text-xs bg-surface/60 text-text-muted px-2 py-0.5 rounded-full border border-surface-border"
          >
            {term}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
        <span className="bg-accent/10 text-accent px-2 py-0.5 rounded font-medium">
          {article.source}
        </span>
        <span>{new Date(article.published_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}</span>
      </div>
    </div>
  );
}
