'use client'

import { useEffect, useState } from 'react'
import { Button, Typography, Space, Spin } from 'antd'
import { api } from '@/lib/api'
import type { Article } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'

const { Text, Title } = Typography

export default function NewsFeedPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [sourceFilter, setSourceFilter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getArticles(sourceFilter ? { source: sourceFilter } : undefined)
      .then((data) => setArticles(Array.isArray(data) ? data : data.articles || []))
      .catch(() => setError('Failed to load articles'))
      .finally(() => setLoading(false))
  }, [sourceFilter])

  const sources = Array.from(new Set(articles.map((a) => a.source)))

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{
          margin: 0,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Today's GK Gist
        </Title>
        <Text style={{ marginTop: 6, display: 'block', opacity: 0.5, fontSize: 14 }}>
          AI-curated current affairs summaries for UPSC preparation
        </Text>
      </div>

      {sources.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <Button
            size="small"
            type={!sourceFilter ? 'primary' : 'default'}
            onClick={() => setSourceFilter('')}
            style={{ fontWeight: 600 }}
          >
            All
          </Button>
          {sources.map((s) => (
            <Button
              key={s}
              size="small"
              type={sourceFilter === s ? 'primary' : 'default'}
              onClick={() => setSourceFilter(s)}
              style={{ fontWeight: 600 }}
            >
              {s}
            </Button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: 'center', fontSize: 14 }}>
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', fontSize: 14 }}>
          No articles found
        </div>
      ) : (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </Space>
      )}
    </div>
  )
}
