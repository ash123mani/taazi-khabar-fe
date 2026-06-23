'use client';

import { Typography } from 'antd';
import dayjs from 'dayjs';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { Article } from '@/lib/types';
import ArticleCard from './ArticleCard';
import { ArticleSkeleton } from './Skeletons';

const { Text } = Typography;

interface ArticleContentProps {
  loading: boolean;
  error: string;
  articles: Article[];
  total: number;
  search: string;
  date: string;
  loadingMore: boolean;
  onLoadMore: () => void;
}

export default function ArticleContent({
  loading,
  error,
  articles,
  total,
  search,
  date,
  loadingMore,
  onLoadMore,
}: ArticleContentProps) {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              borderBottom: '1px solid var(--color-border-light)',
              borderRight: !isMobile && i % 2 === 1 ? '1px solid var(--color-border-light)' : 'none',
              padding: isMobile ? '8px 0' : '12px 12px',
            }}
          >
            <ArticleSkeleton hasImage={isMobile ? true : i % 2 === 0} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px 12px', textAlign: 'center' }}>
        <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div style={{ padding: isMobile ? '32px 12px' : '48px 16px', textAlign: 'center' }}>
        <div
          className="newspaper-heading"
          style={{
            fontSize: isMobile ? 16 : 20,
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            marginBottom: 6,
          }}
        >
          {search ? 'No articles match your search' : `No articles for ${dayjs(date).format('DD-MM-YYYY')}`}
        </div>
        <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>
          {search ? 'Try different keywords' : 'Select another date or source'}
        </Text>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0 }}>
        {articles.map((article, idx) => (
          <div
            key={article.id}
            style={{
              borderBottom: '1px solid var(--color-border-light)',
              borderRight: !isMobile && idx % 2 === 0 ? '1px solid var(--color-border-light)' : 'none',
              padding: isMobile ? '8px 0' : '10px 12px',
            }}
          >
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
      {total > articles.length && (
        <div style={{ textAlign: 'center', marginTop: isMobile ? 16 : 20 }}>
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            style={{
              padding: '6px 24px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              border: '1px solid var(--color-border)',
              cursor: loadingMore ? 'not-allowed' : 'pointer',
              background: 'transparent',
              color: 'var(--color-text-tertiary)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-surface)';
              e.currentTarget.style.color = 'var(--color-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-tertiary)';
            }}
          >
            {loadingMore ? 'Loading...' : `Load More (${articles.length}/${total})`}
          </button>
        </div>
      )}
    </div>
  );
}
