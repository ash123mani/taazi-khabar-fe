'use client'

import { useEffect, useState } from 'react'
import { Typography, Spin, Button, Space, Card, Row, Col, Statistic, Tag } from 'antd'
import { HeartOutlined, LoginOutlined, BookOutlined, StarOutlined } from '@ant-design/icons'
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
      {/* Header */}
      <Card style={{ marginBottom: 28, borderRadius: 16, background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '24px 28px' } }}>
        <Row justify="space-between" align="middle">
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HeartOutlined style={{ fontSize: 20, color: '#fff' }} />
              </div>
              <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px', fontWeight: 700, color: '#fafafa' }}>
                Bookmarked Articles
              </Title>
            </div>
            <Text style={{ color: '#a1a1aa', fontSize: 14, display: 'block', marginTop: 4, marginLeft: 52 }}>
              Articles you have saved for later revision
            </Text>
          </Col>
          {articles.length > 0 && (
            <Col>
              <Statistic
                title={<Text style={{ color: '#a1a1aa', fontSize: 12 }}>Saved Articles</Text>}
                value={articles.length}
                prefix={<HeartOutlined style={{ color: '#ef4444' }} />}
                valueStyle={{ fontWeight: 700, color: '#fafafa' }}
              />
            </Col>
          )}
        </Row>
      </Card>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2].map((i) => <ArticleCardSkeleton key={i} />)}
        </div>
      ) : !token ? (
        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '80px 24px' } }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: '#1c1c1f', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <HeartOutlined style={{ fontSize: 32, color: '#71717a' }} />
          </div>
          <Title level={4} style={{ margin: 0, marginBottom: 8, color: '#d4d4d8' }}>Please login to view your bookmarks</Title>
          <Text style={{ color: '#a1a1aa', fontSize: 14, display: 'block', marginBottom: 24 }}>Save articles to access them anytime</Text>
          <Link href="/login">
            <Button type="primary" size="large" icon={<LoginOutlined />} style={{ fontWeight: 600, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none', height: 44, padding: '0 28px' }}>
              Login
            </Button>
          </Link>
        </Card>
      ) : error ? (
        <Card style={{ borderRadius: 12, background: '#1c1c1f', border: '1px solid #ef4444' }} styles={{ body: { padding: '16px 20px' } }}>
          <Text style={{ color: '#fca5a5' }}>{error}</Text>
        </Card>
      ) : articles.length === 0 ? (
        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '80px 24px' } }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: '#1c1c1f', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <HeartOutlined style={{ fontSize: 32, color: '#71717a' }} />
          </div>
          <Title level={4} style={{ margin: 0, marginBottom: 8, color: '#d4d4d8' }}>No bookmarked articles yet</Title>
          <Text style={{ color: '#a1a1aa', fontSize: 14, display: 'block', marginBottom: 24 }}>Start saving articles for quick revision</Text>
          <Link href="/">
            <Button type="primary" size="large" icon={<BookOutlined />} style={{ fontWeight: 600, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none', height: 44, padding: '0 28px' }}>
              Browse articles
            </Button>
          </Link>
        </Card>
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
