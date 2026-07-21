import type { Metadata } from 'next';
import { api } from '@/lib/api';
import type { Article } from '@/lib/types';
import ArticlePageClient from './ArticlePageClient';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const article = await api.getArticle(params.id);
    const description =
      article.gk_summary?.replace(/<[^>]*>/g, '').slice(0, 160) ||
      `Read ${article.headline} on Taazi Khabar`;
    return {
      title: article.headline,
      description,
      openGraph: {
        title: article.headline,
        description,
        type: 'article',
        images: article.image_url ? [{ url: article.image_url }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.headline,
        description,
        images: article.image_url ? [{ url: article.image_url }] : [],
      },
    };
  } catch {
    return { title: 'Article not found' };
  }
}

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
