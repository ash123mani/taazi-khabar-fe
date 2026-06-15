'use client'

import { useEffect, useState } from 'react'
import { Typography, Empty, Button, message, Card, Spin } from 'antd'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import ArticleCard from '@/components/ArticleCard'

const { Title, Text } = Typography

export default function BookmarksPage() {
  const token = useAuthStore((s) => s.accessToken)
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookmarks = async () => {
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const data = await api.getBookmarkedArticles()
      setArticles(data)
    } catch (err: any) {
      message.error(err.message || 'Failed to load bookmarks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookmarks()
  }, [token])

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Title level={3} style={{ color: 'var(--color-text)' }}>Please login to view bookmarks</Title>
        <Button type="primary" href="/login" style={{ fontWeight: 600, borderRadius: 8 }}>
          Login
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: '80px 24px' } }}>
        <Spin size="large" />
      </Card>
    )
  }

  return (
    <div>
      <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16, color: 'var(--color-text)' }}>Bookmarks</Title>
      {articles.length === 0 ? (
        <Card style={{ borderRadius: 12, textAlign: 'center', padding: 60, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: '60px 24px' } }}>
          <Empty
            description={
              <span style={{ color: 'var(--color-text-tertiary)' }}>
                No bookmarks yet. Start reading and bookmark articles!
              </span>
            }
          />
          <Link href="/">
            <Button type="primary" style={{ marginTop: 16, fontWeight: 600, borderRadius: 8 }}>
              Browse Articles
            </Button>
          </Link>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
