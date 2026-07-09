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
}

export default function ArticleContent({
  loading,
  error,
  articles,
  search,
  date,
}: ArticleContentProps) {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ padding: isMobile ? '8px 0' : '12px 12px' }}>
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
        {articles.map((article) => (
          <div
            key={article.id}
            style={{
              padding: isMobile ? '8px 0' : '10px 12px',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}
