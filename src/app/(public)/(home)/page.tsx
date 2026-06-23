import { api } from '@/lib/api';
import type { Article } from '@/lib/types';
import NewsFeedPageShell from '@/features/news-feed/page-shell';

const PAGE_SIZE = 10;

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

  const [categoriesData, allCountsData, filteredCountsData] = await Promise.all([
    api.getCategories().catch(() => null),
    api.getArticleCounts({ date }).catch(() => null),
    source !== 'all'
      ? api.getArticleCounts({ date, source }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const categories = categoriesData?.categories || categoriesData || [];
  const counts = allCountsData || {};
  const filteredCounts = filteredCountsData || counts;

  return (
    <NewsFeedPageShell
      date={date}
      source={source}
      category={category}
      search={search}
      categories={categories}
      counts={counts}
      filteredCounts={filteredCounts}
    />
  );
}
