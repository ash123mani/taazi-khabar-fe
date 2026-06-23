'use client';

import { useState, useCallback, useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import type { Article } from '@/lib/types';
import NewsMasthead from '@/components/NewsMasthead';
import FilterBar from '@/components/FilterBar';
import ArticleContent from '@/components/ArticleContent';
import { ArticleSkeleton } from '@/components/Skeletons';
import { useIsMobile } from '@/hooks/useIsMobile';

const PAGE_SIZE = 10;

interface NewsFeedClientProps {
  date: string;
  initialArticles: Article[];
  initialTotal: number;
  categories: { id: string; name: string }[];
  counts: Record<string, any>;
  filteredCounts: Record<string, any>;
  source: string;
  category: string;
  search: string;
}

function GridSkeleton() {
  const isMobile = useIsMobile();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0 }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            borderBottom: '1px solid var(--color-border-light)',
            borderRight: !isMobile && i % 2 === 1 ? '1px solid var(--color-border-light)' : 'none',
            padding: isMobile ? '8px 0' : '10px 12px',
          }}
        >
          <ArticleSkeleton hasImage={isMobile ? true : i % 2 === 0} />
        </div>
      ))}
    </div>
  );
}

export default function NewsFeedClient({
  date,
  initialArticles,
  initialTotal,
  categories,
  counts,
  filteredCounts,
  source,
  category,
  search,
}: NewsFeedClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [activeSource, setActiveSource] = useState(source);
  const [activeCategory, setActiveCategory] = useState(category);

  useEffect(() => {
    setActiveSource(source);
    setActiveCategory(category);
  }, [source, category]);

  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchInput, setSearchInput] = useState(search);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(initialTotal);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState('');

  const navigate = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const d = overrides.date ?? date;
      const s = overrides.source ?? source;
      const c = overrides.category ?? category;
      const q = overrides.search ?? search;
      if (d) params.set('date', d);
      if (s && s !== 'all') params.set('source', s);
      if (c && c !== 'all') params.set('category', c);
      if (q) params.set('search', q);
      const qs = params.toString();
      startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname));
    },
    [pathname, router, date, source, category, search],
  );

  const handleSourceChange = useCallback((key: string) => {
    setActiveSource(key);
    setActiveCategory('all');
    navigate({ source: key, category: 'all' });
  }, [navigate]);

  const handleCategoryChange = useCallback((key: string) => {
    setActiveCategory(key);
    navigate({ category: key });
  }, [navigate]);

  const handleDateChange = useCallback((newDate: string) => navigate({ date: newDate }), [navigate]);

  const handleSearch = useCallback(() => {
    navigate({ search: searchInput });
  }, [navigate, searchInput]);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    navigate({ search: '' });
  }, [navigate]);

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
      setArticles((prev) => [...prev, ...list]);
      setTotal(data.total || list.length);
    } catch {
      setLoadError('Failed to load more');
    } finally {
      setLoadingMore(false);
    }
  }, [date, source, category, search, skip]);

  const catTotal = filteredCounts?.categories
    ? Object.values(filteredCounts.categories).reduce((a: number, b: any) => a + (b as number), 0)
    : 0;

  return (
    <div style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s' }}>
      <NewsMasthead date={date} onDateChange={handleDateChange} />

      <FilterBar
        date={date}
        source={activeSource}
        category={activeCategory}
        search={search}
        categories={categories}
        counts={counts}
        catTotal={catTotal}
        filteredCounts={filteredCounts}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        onSourceChange={handleSourceChange}
        onCategoryChange={handleCategoryChange}
      />
      {isPending ? (
        <GridSkeleton />
      ) : (
        <ArticleContent
          loading={false}
          error={loadError}
          articles={articles}
          total={total}
          search={search}
          date={date}
          loadingMore={loadingMore}
          onLoadMore={handleLoadMore}
        />
      )}


    </div>
  );
}
