'use client'

import { useEffect, useState, useCallback } from 'react'
import { Typography, Card, Row, Col, Input, Segmented, DatePicker, Button, Space } from 'antd'
import { CalendarOutlined, BookOutlined, SearchOutlined, FireOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { api } from '@/lib/api'
import type { Article } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'
import { ArticleSkeleton } from '@/components/Skeletons'

const { Title, Text } = Typography

const PAGE_SIZE = 10

export default function NewsFeedPage() {
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState<string>(today)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [sourceFilter, setSourceFilter] = useState('all')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [skip, setSkip] = useState(0)
  const [total, setTotal] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [sources, setSources] = useState<string[]>(['all'])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    api.getCategories().then((data: any) => {
      const list = data.categories || data || []
      setCategories(list)
    }).catch(() => {})
  }, [])

  const fetchArticles = useCallback(async (d: string, source: string, cat: string, s: string, skipVal: number, append = false) => {
    if (!append) setLoading(true)
    setError('')
    try {
      const params: Record<string, string> = { date: d, skip: String(skipVal), limit: String(PAGE_SIZE) }
      if (source && source !== 'all') params.source = source
      if (cat && cat !== 'all') params.category_id = cat
      if (s) params.search = s
      const data = await api.getArticles(params)
      const list = Array.isArray(data) ? data : data.articles || []
      const totalCount = data.total || list.length
      if (append) {
        setArticles(prev => [...prev, ...list])
      } else {
        setArticles(list)
      }
      setTotal(totalCount)
      if (!append && list.length > 0) {
        const allSources = Array.from(new Set(list.map((a: Article) => a.source))) as string[]
        setSources(['all', ...allSources])
      }
    } catch {
      setError('Failed to load articles')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    setSkip(0)
    fetchArticles(date, sourceFilter, categoryFilter, search, 0)
  }, [date, sourceFilter, categoryFilter, search, fetchArticles])

  const handleSearch = () => {
    setSearch(searchInput)
    setSkip(0)
  }

  const handleLoadMore = () => {
    const newSkip = skip + PAGE_SIZE
    setSkip(newSkip)
    setLoadingMore(true)
    fetchArticles(date, sourceFilter, categoryFilter, search, newSkip, true)
  }

  return (
    <div>
      <Card
        style={{
          marginBottom: 28,
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 35%, #312e81 80%, rgba(5,5,5,0.95) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(99, 102, 241, 0.12)',
        }}
        styles={{ body: { padding: '32px 28px' } }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={14}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(99,102,241,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}>
                <BookOutlined style={{ fontSize: 20, color: '#a5b4fc' }} />
              </div>
              <div>
                <Text style={{ color: 'rgba(165,180,252,0.7)', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  News Digest
                </Text>
                <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
                  GK Gist
                </Title>
              </div>
            </div>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, display: 'block', lineHeight: 1.6 }}>
              AI-curated current affairs summaries for UPSC preparation. Stay ahead with daily updates from trusted sources.
            </Text>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: 'right' }}>
            <DatePicker
              value={dayjs(date)}
              onChange={(d) => { if (d) setDate(d.format('YYYY-MM-DD')) }}
              allowClear={false}
              suffixIcon={<CalendarOutlined style={{ color: 'rgba(255,255,255,0.6)' }} />}
              size="large"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10,
                backdropFilter: 'blur(4px)',
              }}
            />
          </Col>
        </Row>
      </Card>

      <Card style={{ marginBottom: 24, borderRadius: 12, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: '14px 18px' } }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={14}>
            <Space size={8} wrap>
              <Segmented
                options={[
                  { label: 'All', value: 'all', icon: <BookOutlined /> },
                  ...sources.filter(s => s !== 'all').map((s) => ({
                    label: s === 'thehindu' ? 'The Hindu' : s === 'indianexpress' ? 'Indian Express' : s,
                    value: s,
                  })),
                ]}
                value={sourceFilter}
                onChange={(val) => setSourceFilter(val as string)}
                size="small"
              />
            </Space>
          </Col>
          <Col xs={24} md={10}>
            <Input.Search
              placeholder="Search articles..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onSearch={handleSearch}
              allowClear
              size="small"
              style={{ width: '100%' }}
              prefix={<SearchOutlined style={{ color: 'var(--color-text-tertiary)' }} />}
            />
          </Col>
        </Row>
        {categories.length > 0 && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {[
                { label: 'All Topics', value: 'all' },
                ...categories.map((c) => ({ label: c.name, value: c.id })),
              ].map((opt) => {
                const active = categoryFilter === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setCategoryFilter(opt.value)}
                    style={{
                      padding: '2px 10px',
                      fontSize: 12,
                      fontWeight: active ? 600 : 400,
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      background: active ? '#6366f1' : 'var(--color-surface)',
                      color: active ? 'var(--color-text)' : 'var(--color-text-secondary)',
                      transition: 'all 0.15s',
                      lineHeight: '24px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        {!loading && (
          <div style={{ marginTop: 6, textAlign: 'right' }}>
            <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>
              {total} article{total !== 1 ? 's' : ''}
            </Text>
          </div>
        )}
      </Card>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map((i) => <ArticleSkeleton key={i} />)}
        </div>
      ) : error ? (
        <Card style={{ borderRadius: 12, background: 'var(--color-surface)', border: '1px solid #ef4444' }} styles={{ body: { padding: '16px 20px' } }}>
          <Text style={{ color: '#fca5a5' }}>{error}</Text>
        </Card>
      ) : articles.length === 0 ? (
        <Card style={{ borderRadius: 12, textAlign: 'center', padding: '60px 24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: '60px 24px' } }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--color-surface)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <BookOutlined style={{ fontSize: 28, color: '#4a4a4a' }} />
          </div>
          <Title level={4} style={{ margin: 0, marginBottom: 8, color: 'var(--color-text-secondary)' }}>
            {search ? 'No articles match your search' : `No articles found for ${date}`}
          </Title>
          <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 14 }}>
            {search ? 'Try adjusting your search terms' : 'Try selecting a different date or source'}
          </Text>
        </Card>
      ) : (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {total > articles.length && (
            <div style={{ textAlign: 'center', marginTop: 28, marginBottom: 12 }}>
              <Button
                type="primary"
                onClick={handleLoadMore}
                loading={loadingMore}
                size="large"
                style={{ fontWeight: 600, borderRadius: 10, padding: '0 32px', height: 44, fontSize: 14 }}
              >
                Load More ({articles.length}/{total})
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
