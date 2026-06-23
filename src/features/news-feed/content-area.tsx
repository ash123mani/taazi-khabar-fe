'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import { api } from '@/lib/api';
import type { Article } from '@/lib/types';
import ArticleCard from '@/components/ArticleCard';
import GridSkeleton from './grid-skeleton';
import LoadMoreButton from './load-more-button';

const { Text } = Typography;
const PAGE_SIZE = 10;

interface ContentAreaProps {
  date: string;
  source: string;
  category: string;
  search: string;
  total: number;
  initialCount: number;
  children: React.ReactNode;
}

export default function ContentArea({
  date,
  source,
  category,
  search,
  total: initialTotal,
  initialCount,
  children,
}: ContentAreaProps) {
  const searchParams = useSearchParams();
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [loadedArticles, setLoadedArticles] = useState<Article[]>([]);
  const [skip, setSkip] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(initialTotal);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState('');
  const prevUrlRef = useRef('');
  const prevPropsRef = useRef(`${date}|${source}|${category}|${search}`);

  const urlDate = searchParams.get('date') || '';
  const urlSource = searchParams.get('source') || 'all';
  const urlCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('search') || '';
  const urlKey = `${urlDate}|${urlSource}|${urlCategory}|${urlSearch}`;
  const propsKey = `${date}|${source}|${category}|${search}`;

  // Reset loaded articles on param change (render-phase sync update)
  if (propsKey !== prevPropsRef.current) {
    prevPropsRef.current = propsKey;
    loadedArticles.length = 0;
    setLoadedArticles([]);
    setSkip(0);
    setCurrentTotal(initialTotal);
    setLoadError('');
  }

  useEffect(() => {
    if (!prevUrlRef.current) {
      prevUrlRef.current = urlKey;
      return;
    }

    if (urlKey && urlKey !== prevUrlRef.current) {
      prevUrlRef.current = urlKey;
      setShowSkeleton(true);
    }

    if (showSkeleton && urlKey && propsKey === urlKey) {
      setShowSkeleton(false);
    }
  }, [urlKey, propsKey, showSkeleton]);

  const handleLoadMore = useCallback(async () => {
    const newSkip = skip + PAGE_SIZE;
    setSkip(newSkip);
    setLoadingMore(true);
    setLoadError('');
    try {
      const params: Record<string, string> = {
        date,
        skip: String(newSkip),
        limit: String(PAGE_SIZE),
      };
      if (source !== 'all') params.source = source;
      if (category !== 'all') params.category_id = category;
      if (search) params.search = search;
      const data = await api.getArticles(params);
      const list = Array.isArray(data) ? data : data.articles || [];
      setLoadedArticles((prev) => [...prev, ...list]);
      setCurrentTotal(data.total || list.length);
    } catch {
      setLoadError('Failed to load more');
    } finally {
      setLoadingMore(false);
    }
  }, [date, source, category, search, skip]);

  const hasInitial = initialCount > 0;
  const hasLoaded = loadedArticles.length > 0;
  const isEmpty = !hasInitial && !hasLoaded;
  const displayCount = initialCount + loadedArticles.length;

  if (showSkeleton) {
    return <GridSkeleton />;
  }

  return (
    <>
      <style>{`
        .article-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }
        .article-grid-cell {
          border-bottom: 1px solid var(--color-border-light);
          padding: 10px 12px;
        }
        .article-grid-cell:nth-child(odd) {
          border-right: 1px solid var(--color-border-light);
        }
        @media (max-width: 575px) {
          .article-grid {
            grid-template-columns: 1fr;
          }
          .article-grid-cell {
            padding: 8px 0;
            border-right: none !important;
          }
          .empty-state {
            padding: 32px 12px !important;
          }
          .empty-state-heading {
            font-size: 16px !important;
          }
        }
      `}</style>

      {isEmpty ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '48px 16px' }}>
          <div
            className="newspaper-heading empty-state-heading"
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: 6,
            }}
          >
            {search
              ? 'No articles match your search'
              : `No articles for ${dayjs(date).format('DD-MM-YYYY')}`}
          </div>
          <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>
            {search ? 'Try different keywords' : 'Select another date or source'}
          </Text>
        </div>
      ) : (
        <>
          <div className="article-grid">
            {children}
            {loadedArticles.map((article) => (
              <div key={article.id} className="article-grid-cell">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>

          {loadError && (
            <div
              style={{
                textAlign: 'center',
                color: '#ef4444',
                fontSize: 13,
                padding: '8px 0',
              }}
            >
              {loadError}
            </div>
          )}

          <LoadMoreButton
            onClick={handleLoadMore}
            loading={loadingMore}
            current={displayCount}
            total={currentTotal}
          />
        </>
      )}
    </>
  );
}
