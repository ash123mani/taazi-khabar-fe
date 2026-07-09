import { api } from '@/lib/api';
import type { Article } from '@/lib/types';
import ArticlePageClient from './ArticlePageClient';

export default async function ArticlePage({ params }: { params: { id: string } }) {
  let article: Article | null = null;
  try {
    article = await api.getArticle(params.id);
  } catch {
    // fall through to null
  }

  if (!article) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Article not found</h1>
        <p style={{ color: 'var(--color-text-tertiary)' }}>The article you are looking for does not exist.</p>
      </div>
    );
  }

  return <ArticlePageClient article={article} />;
}
