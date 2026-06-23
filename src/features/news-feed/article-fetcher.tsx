import { api } from '@/lib/api';
import type { Article } from '@/lib/types';
import ContentArea from './content-area';
import ArticleContent from './article-content';

const PAGE_SIZE = 10;

export default async function ArticleFetcher({
  date,
  source,
  category,
  search,
}: {
  date: string;
  source: string;
  category: string;
  search: string;
}) {
  const params: Record<string, string> = {
    date,
    skip: '0',
    limit: String(PAGE_SIZE),
  };
  if (source !== 'all') params.source = source;
  if (category !== 'all') params.category_id = category;
  if (search) params.search = search;

  const data = await api.getArticles(params).catch(() => null);

  const articles: Article[] = Array.isArray(data) ? data : data?.articles || [];
  const total = data?.total || articles.length;

  return (
    <ContentArea
      date={date}
      source={source}
      category={category}
      search={search}
      total={total}
      initialCount={articles.length}
    >
      {articles.length > 0 && <ArticleContent articles={articles} />}
    </ContentArea>
  );
}
