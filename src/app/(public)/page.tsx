'use client'

import { useEffect, useState, useCallback } from 'react'
import { Typography, Card, Row, Col, Input, Segmented, DatePicker, Button, Space } from 'antd'
import { CalendarOutlined, BookOutlined, SearchOutlined, FireOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { api } from '@/lib/api'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Article } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'
import { ArticleSkeleton } from '@/components/Skeletons'

const { Title, Text } = Typography

const PAGE_SIZE = 10

export default function NewsFeedPage() {
  const isMobile = useIsMobile()
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
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [counts, setCounts] = useState<Record<string, any>>({})
  const [filteredCounts, setFilteredCounts] = useState<Record<string, any>>({})

  useEffect(() => {
    api.getCategories().then((data: any) => {
      const list = data.categories || data || []
      setCategories(list)
    }).catch(() => {})
  }, [])

  const fetchCounts = useCallback(async (d: string, source: string) => {
    try {
      const [all, filtered] = await Promise.all([
        api.getArticleCounts({ date: d }),
        source !== 'all' ? api.getArticleCounts({ date: d, source }) : Promise.resolve(null),
      ])
      setCounts(all || {})
      setFilteredCounts(filtered || all || {})
      if (all?._error) console.error('Counts error:', all._error)
    } catch (err) {
      console.error('Failed to fetch counts:', err)
    }
  }, [])

  useEffect(() => {
    fetchCounts(date, sourceFilter)
  }, [date, sourceFilter, fetchCounts])

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
        styles={{ body: { padding: isMobile ? '20px 16px' : '32px 28px' } }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={14}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 10 }}>
                <div style={{
                  width: isMobile ? 28 : 40, height: isMobile ? 28 : 40, borderRadius: 8,
                  background: 'rgba(99,102,241,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)', flexShrink: 0,
                }}>
                  <BookOutlined style={{ fontSize: isMobile ? 14 : 20, color: '#a5b4fc' }} />
                </div>
                <div>
                  <Text style={{ color: 'rgba(165,180,252,0.7)', fontSize: isMobile ? 9 : 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block' }}>
                    News Digest
                  </Text>
                  <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', fontSize: isMobile ? 15 : 20 }}>
                    GK Gist
                  </Title>
                </div>
              </div>
              {isMobile && (
                <DatePicker
                  value={dayjs(date)}
                  onChange={(d) => { if (d) setDate(d.format('YYYY-MM-DD')) }}
                  allowClear={false}
                  format="DD-MM-YYYY"
                  suffixIcon={<CalendarOutlined style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }} />}
                  size="small"
                  style={{
                    width: 120,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8,
                    fontSize: 11,
                    backdropFilter: 'blur(4px)',
                  }}
                />
              )}
            </div>
            {!isMobile && (
              <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, display: 'block', lineHeight: 1.6, marginTop: 6 }}>
                AI-curated current affairs summaries for UPSC preparation. Stay ahead with daily updates from trusted sources.
              </Text>
            )}
          </Col>
          {!isMobile && (
            <Col md={10} style={{ textAlign: 'right' }}>
              <DatePicker
                value={dayjs(date)}
                onChange={(d) => { if (d) setDate(d.format('YYYY-MM-DD')) }}
                allowClear={false}
                format="DD-MM-YYYY"
                suffixIcon={<CalendarOutlined style={{ color: 'rgba(255,255,255,0.6)' }} />}
                size="middle"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 10,
                  backdropFilter: 'blur(4px)',
                }}
              />
            </Col>
          )}
        </Row>
      </Card>

      <Card style={{ marginBottom: isMobile ? 16 : 24, borderRadius: 12, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: isMobile ? '10px 12px' : '14px 18px' } }}>
        <Row gutter={[8, 8]} align="middle">
          <Col xs={24} md={14}>
            <div style={{ overflow: 'auto', paddingBottom: 4 }}>
              <Segmented
                options={[
                  { label: `All (${counts.total || 0})`, value: 'all' },
                  { label: `The Hindu (${counts.thehindu || 0})`, value: 'thehindu' },
                  { label: `Indian Express (${counts.indianexpress || 0})`, value: 'indianexpress' },
                ]}
                value={sourceFilter}
                onChange={(val) => setSourceFilter(val as string)}
                size="small"
              />
            </div>
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
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {[
                { label: 'All Topics', value: 'all' },
                ...categories.map((c) => ({ label: c.name, value: c.id })),
              ].map((opt) => {
                const active = categoryFilter === opt.value
                const catCount = opt.value === 'all'
                  ? (filteredCounts?.categories ? Object.values(filteredCounts.categories).reduce((a: number, b: any) => a + (b as number), 0) : 0)
                  : (filteredCounts?.categories?.[opt.value] || 0)
                return (
                  <button
                    key={opt.value}
                    onClick={() => setCategoryFilter(opt.value)}
                    style={{
                      padding: isMobile ? '1px 8px' : '2px 10px',
                      fontSize: isMobile ? 11 : 12,
                      fontWeight: active ? 600 : 400,
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      background: active ? '#6366f1' : 'var(--color-surface)',
                      color: active ? 'var(--color-text)' : 'var(--color-text-secondary)',
                      transition: 'all 0.15s',
                      lineHeight: isMobile ? '20px' : '24px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {opt.label} ({catCount})
                  </button>
                )
              })}
            </div>
          </div>
        )}
        {!loading && (
          <div style={{ marginTop: 4, textAlign: 'right' }}>
            <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 11 }}>
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
            {search ? 'No articles match your search' : `No articles found for ${dayjs(date).format('DD-MM-YYYY')}`}
          </Title>
          <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 14 }}>
            {search ? 'Try adjusting your search terms' : 'Try selecting a different date or source'}
          </Text>
        </Card>
      ) : (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {total > articles.length && (
            <div style={{ textAlign: 'center', marginTop: isMobile ? 16 : 24, marginBottom: 8 }}>
              <Button
                type="primary"
                onClick={handleLoadMore}
                loading={loadingMore}
                size={isMobile ? 'middle' : 'large'}
                style={{ fontWeight: 600, borderRadius: 8, padding: isMobile ? '0 20px' : '0 32px', height: isMobile ? 36 : 44, fontSize: isMobile ? 13 : 14 }}
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
