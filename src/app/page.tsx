'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Typography, Space, Spin } from 'antd'
import { ThunderboltOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'
import type { Article } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'

const { Text, Title } = Typography

export default function NewsFeedPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sourceFilter, setSourceFilter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getArticles(sourceFilter ? { source: sourceFilter } : undefined)
      .then((data) => setArticles(Array.isArray(data) ? data : data.articles || []))
      .catch(() => setError('Failed to load articles'))
      .finally(() => setLoading(false))
  }, [sourceFilter])

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const sources = Array.from(new Set(articles.map((a) => a.source)))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px' }}>News Feed</Title>
          <Text type="secondary" style={{ color: '#666', marginTop: 4, display: 'block' }}>
            Browse and select articles to generate quizzes
          </Text>
        </div>
      </div>

      {sources.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <Button
            size="small"
            type={!sourceFilter ? 'primary' : 'default'}
            onClick={() => setSourceFilter('')}
            style={{ borderRadius: 0, border: '2px solid #000', fontWeight: 600 }}
          >
            All
          </Button>
          {sources.map((s) => (
            <Button
              key={s}
              size="small"
              type={sourceFilter === s ? 'primary' : 'default'}
              onClick={() => setSourceFilter(s)}
              style={{ borderRadius: 0, border: '2px solid #000', fontWeight: 600 }}
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
        <div style={{ padding: 40, border: '2px solid #000', textAlign: 'center', fontSize: 14, color: '#666' }}>
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div style={{ padding: 40, border: '2px solid #000', textAlign: 'center', fontSize: 14, color: '#666' }}>
          No articles found
        </div>
      ) : (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {articles.map((article) => (
            <div key={article.id} style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  background: selected.has(article.id) ? '#000' : '#fff',
                  border: '2px solid #000',
                }}
                onClick={() => toggleSelect(article.id)}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    border: '2px solid #000',
                    background: selected.has(article.id) ? '#fff' : '#fff',
                  }}
                />
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: selected.has(article.id) ? '#fff' : '#000',
                }}>
                  {selected.has(article.id) ? 'SELECTED' : 'SELECT'}
                </span>
              </div>
              <ArticleCard article={article} />
            </div>
          ))}
        </Space>
      )}

      {selected.size > 0 && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={() => {
              const ids = Array.from(selected).join(',')
              router.push(`/quiz?selected=${ids}`)
            }}
            style={{
              borderRadius: 0,
              height: 48,
              padding: '0 32px',
              fontWeight: 700,
              fontSize: 15,
              border: '3px solid #000',
              boxShadow: 'none',
            }}
          >
            Generate Quiz ({selected.size} articles selected)
          </Button>
        </div>
      )}
    </div>
  )
}
