'use client'

import { useEffect, useState } from 'react'
import { Typography, Spin, Button, Space } from 'antd'
import { HeartOutlined, LoginOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import type { Article } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'
import { ArticleCardSkeleton } from '@/components/Skeletons'

const { Title, Text } = Typography

export default function BookmarksPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const token = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    api
      .getBookmarkedArticles()
      .then((data) => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load bookmarks'))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div>
      <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px' }}>
        Bookmarked Articles
      </Title>
      <Text style={{ display: 'block', marginBottom: 24, color: '#9e9e9e', fontSize: 14 }}>
        Articles you have saved for later revision
      </Text>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2].map((i) => <ArticleCardSkeleton key={i} />)}
        </div>
      ) : !token ? (
        <div style={{ padding: 80, textAlign: 'center' }}>
          <HeartOutlined style={{ fontSize: 40, color: '#d0d0d0', display: 'block', marginBottom: 16 }} />
          <Text style={{ display: 'block', marginBottom: 16, fontSize: 15, color: '#9e9e9e' }}>
            Please login to view your bookmarks
          </Text>
          <Link href="/login">
            <Button type="primary" style={{ fontWeight: 600 }} icon={<LoginOutlined />}>Login</Button>
          </Link>
        </div>
      ) : error ? (
        <div style={{ padding: '10px 14px', border: '1px solid #c62828', borderRadius: 6, background: '#ffebee', color: '#c62828', fontSize: 14 }}>
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div style={{ padding: 80, textAlign: 'center' }}>
          <HeartOutlined style={{ fontSize: 40, color: '#d0d0d0', display: 'block', marginBottom: 16 }} />
          <Text style={{ display: 'block', marginBottom: 16, fontSize: 15, color: '#9e9e9e' }}>
            No bookmarked articles yet
          </Text>
          <Link href="/">
            <Button type="primary" style={{ fontWeight: 600 }}>
              Browse articles
            </Button>
          </Link>
        </div>
      ) : (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </Space>
      )}
    </div>
  )
}
