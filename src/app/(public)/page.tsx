import type { Metadata } from 'next';
import { api } from '@/lib/api';
import type { Article } from '@/lib/types';
import NewsFeedClient from '@/app/(public)/_components/NewsFeedClient';

export const metadata: Metadata = {
  title: 'Daily Current Affairs',
  description:
    'Stay updated with AI-powered daily current affairs analysis for UPSC preparation. Read news from The Hindu, Indian Express, PIB and more.',
  openGraph: {
    title: 'Daily Current Affairs | Taazi Khabar',
    description:
      'Stay updated with AI-powered daily current affairs analysis for UPSC preparation.',
    type: 'website',
  },
};

export default async function NewsFeedPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const today = new Date().toISOString().slice(0, 10);

  const getParam = (v: string | string[] | undefined, fallback: string): string => {
    if (Array.isArray(v)) return v[0];
    return v ?? fallback;
  };

  const date = getParam(searchParams.date, today).slice(0, 10);
  const source = getParam(searchParams.source, 'all');
  const category = getParam(searchParams.category, 'all');
  const search = getParam(searchParams.search, '');

  const articleParams: Record<string, string> = {
    date,
    skip: '0',
    limit: '20',
  };
  if (source !== 'all') articleParams.source = source;
  if (category !== 'all') articleParams.category_id = category;
  if (search) articleParams.search = search;

  const [categoriesData, allCountsData, filteredCountsData, articlesData] = await Promise.all([
    api.getCategories().catch(() => null),
    api.getArticleCounts({ date }).catch(() => null),
    source !== 'all'
      ? api.getArticleCounts({ date, source }).catch(() => null)
      : Promise.resolve(null),
    api.getArticles(articleParams).catch(() => null),
  ]);

  const categories = categoriesData?.categories || categoriesData || [];
  const counts = allCountsData || {};
  const filteredCounts = filteredCountsData || counts;

  const articles: Article[] = Array.isArray(articlesData)
    ? articlesData
    : articlesData?.articles || [];
  const total = articlesData?.total || articles.length;

  const key = `${date}-${source}-${category}-${search}`;

  return (
    <NewsFeedClient
      key={key}
      date={date}
      initialArticles={articles}
      initialTotal={total}
      categories={categories}
      counts={counts}
      filteredCounts={filteredCounts}
      source={source}
      category={category}
      search={search}
    />
  );
}
