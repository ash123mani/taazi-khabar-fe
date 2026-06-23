import type { Article } from '@/lib/types';
import ArticleCard from '@/components/ArticleCard';

export default function ArticleContent({ articles }: { articles: Article[] }) {
  return articles.map((article) => (
    <div key={article.id} className="article-grid-cell">
      <ArticleCard article={article} />
    </div>
  ));
}
