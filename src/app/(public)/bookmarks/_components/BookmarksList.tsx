'use client';

import { Typography, Button } from 'antd';
import Link from 'next/link';
import ArticleCard from '@/app/(public)/_components/ArticleCard';

const { Text } = Typography;

export default function BookmarksList({ articles }: { articles: any[] }) {
  if (articles.length === 0) {
    return (
      <div>
        <Text style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 6, display: 'block' }}>
          Reading List
        </Text>
        <div className="newspaper-heading" style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.3px', color: 'var(--color-text)', lineHeight: 1.15, marginBottom: 24 }}>
          Clippings
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 12, padding: '32px 20px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
          <div className="newspaper-heading" style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            No bookmarks yet
          </div>
          <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 13, display: 'block', marginBottom: 20 }}>
            Start reading and bookmark articles to save them here
          </Text>
          <Link href="/">
            <Button type="primary" style={{ fontWeight: 600, borderRadius: 8, height: 38, padding: '0 24px', fontSize: 13 }}>
              Browse Articles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Text style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 6, display: 'block' }}>
        Reading List
      </Text>
      <div className="newspaper-heading" style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.3px', color: 'var(--color-text)', lineHeight: 1.15, marginBottom: 24 }}>
        Clippings
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Text style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 2 }}>
          {articles.length} Saved Article{articles.length !== 1 ? 's' : ''}
        </Text>
        {articles.map((article: any) => (
          <div
            key={article.id}
            style={{ background: 'var(--color-surface)', borderRadius: 12, padding: '12px 14px', border: '1px solid var(--color-border)' }}
          >
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}
