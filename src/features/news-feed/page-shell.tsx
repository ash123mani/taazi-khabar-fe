import { Suspense } from 'react';
import NewsMasthead from './news-masthead';
import FilterBar from './filter-bar';
import GridSkeleton from './grid-skeleton';
import ArticleFetcher from './article-fetcher';

interface PageShellProps {
  date: string;
  source: string;
  category: string;
  search: string;
  categories: { id: string; name: string }[];
  counts: Record<string, any>;
  filteredCounts: Record<string, any>;
}

export default function NewsFeedPageShell({
  date,
  source,
  category,
  search,
  categories,
  counts,
  filteredCounts,
}: PageShellProps) {
  return (
    <div>
      <NewsMasthead date={date} />

      <FilterBar
        source={source}
        category={category}
        date={date}
        categories={categories}
        counts={counts}
        filteredCounts={filteredCounts}
      />

      <Suspense fallback={<GridSkeleton />}>
        <ArticleFetcher
          date={date}
          source={source}
          category={category}
          search={search}
        />
      </Suspense>
    </div>
  );
}
