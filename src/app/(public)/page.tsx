'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Article } from '@/lib/types';
import NewsMasthead from '@/components/NewsMasthead';
import FilterBar from '@/components/FilterBar';
import ArticleContent from '@/components/ArticleContent';

const PAGE_SIZE = 10;

export default function NewsFeedPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(today);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [counts, setCounts] = useState<Record<string, any>>({});
  const [filteredCounts, setFilteredCounts] = useState<Record<string, any>>({});

  useEffect(() => {
    api
      .getCategories()
      .then((data: any) => {
        const list = data.categories || data || [];
        setCategories(list);
      })
      .catch(() => {});
  }, []);

  const fetchCounts = useCallback(async (d: string, source: string) => {
    try {
      const [all, filtered] = await Promise.all([
        api.getArticleCounts({ date: d }),
        source !== 'all' ? api.getArticleCounts({ date: d, source }) : Promise.resolve(null),
      ]);
      setCounts(all || {});
      setFilteredCounts(filtered || all || {});
    } catch (err) {
      console.error('Failed to fetch counts:', err);
    }
  }, []);

  useEffect(() => {
    fetchCounts(date, sourceFilter);
  }, [date, sourceFilter, fetchCounts]);

  const fetchArticles = useCallback(
    async (d: string, source: string, cat: string, s: string, skipVal: number, append = false) => {
      if (!append) setLoading(true);
      setError('');
      try {
        const params: Record<string, string> = { date: d, skip: String(skipVal), limit: String(PAGE_SIZE) };
        if (source && source !== 'all') params.source = source;
        if (cat && cat !== 'all') params.category_id = cat;
        if (s) params.search = s;
        const data = await api.getArticles(params);
        const list = Array.isArray(data) ? data : data.articles || [];
        const totalCount = data.total || list.length;
        if (append) setArticles((prev) => [...prev, ...list]);
        else setArticles(list);
        setTotal(totalCount);
      } catch {
        setError('Failed to load articles');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    setSkip(0);
    fetchArticles(date, sourceFilter, categoryFilter, search, 0);
  }, [date, sourceFilter, categoryFilter, search, fetchArticles]);

  const handleSearch = () => {
    setSearch(searchInput);
    setSkip(0);
  };

  const handleLoadMore = () => {
    const newSkip = skip + PAGE_SIZE;
    setSkip(newSkip);
    setLoadingMore(true);
    fetchArticles(date, sourceFilter, categoryFilter, search, newSkip, true);
  };

  const catTotal = filteredCounts?.categories
    ? Object.values(filteredCounts.categories).reduce((a: number, b: any) => a + (b as number), 0)
    : 0;

  return (
    <div>
      <NewsMasthead date={date} onDateChange={setDate} />

      <FilterBar
        sourceFilter={sourceFilter}
        onSourceChange={(key) => {
          setSourceFilter(key);
          setCategoryFilter('all');
        }}
        categories={categories}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        counts={counts}
        catTotal={catTotal}
        filteredCounts={filteredCounts}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onClear={() => {
          setSearchInput('');
          setSearch('');
          setSkip(0);
          fetchArticles(date, sourceFilter, categoryFilter, '', 0);
        }}
      />

      <ArticleContent
        loading={loading}
        error={error}
        articles={articles}
        total={total}
        search={search}
        date={date}
        loadingMore={loadingMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
