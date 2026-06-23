'use client';

import { useEffect, useState } from 'react';
import { Typography, Spin, Button } from 'antd';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import ArticleCard from '@/app/(public)/_components/ArticleCard';
import { useIsMobile } from '@/hooks/useIsMobile';

const { Text } = Typography;

export default function BookmarksPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  const fetchBookmarks = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.getBookmarkedArticles();
      setArticles(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [token]);

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div
          className="newspaper-heading"
          style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 12 }}
        >
          Please login to view bookmarks
        </div>
        <Button
          type="primary"
          href="/login"
          style={{
            fontWeight: 600,
            borderRadius: 2,
            letterSpacing: '0.5px',
            fontSize: 12,
            height: 36,
            padding: '0 24px',
          }}
        >
          Login
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Text
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
          marginBottom: 6,
          display: 'block',
        }}
      >
        Reading List
      </Text>
      <div
        className="newspaper-heading"
        style={{
          fontWeight: 800,
          fontSize: isMobile ? 20 : 26,
          letterSpacing: '-0.3px',
          color: 'var(--color-text)',
          lineHeight: 1.15,
          marginBottom: isMobile ? 16 : 24,
        }}
      >
        Clippings
      </div>
      {articles.length === 0 ? (
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 12,
            padding: isMobile ? '32px 20px' : '48px 32px',
            textAlign: 'center',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            className="newspaper-heading"
            style={{
              fontSize: isMobile ? 16 : 20,
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: 6,
            }}
          >
            No bookmarks yet
          </div>
          <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 13, display: 'block', marginBottom: 20 }}>
            Start reading and bookmark articles to save them here
          </Text>
          <Link href="/">
            <Button
              type="primary"
              style={{ fontWeight: 600, borderRadius: 8, height: 38, padding: '0 24px', fontSize: 13 }}
            >
              Browse Articles
            </Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-text-tertiary)',
              marginBottom: 2,
            }}
          >
            {articles.length} Saved Article{articles.length !== 1 ? 's' : ''}
          </Text>
          {articles.map((article) => (
            <div
              key={article.id}
              style={{
                background: 'var(--color-surface)',
                borderRadius: 12,
                padding: isMobile ? '12px 14px' : '14px 18px',
                border: '1px solid var(--color-border)',
              }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
