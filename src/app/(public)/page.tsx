'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button, Typography, Spin, DatePicker, Segmented, Input, Space, Card, Row, Col, Statistic, Tag, Divider, Badge } from 'antd'
import { CalendarOutlined, BookOutlined, SearchOutlined, FireOutlined, TrophyOutlined, ClockCircleOutlined, RocketOutlined, StarOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { api } from '@/lib/api'
import type { Article } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'
import { ArticleCardSkeleton } from '@/components/Skeletons'

const { Text, Title } = Typography

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

  const fetchArticles = useCallback(async (d: string, source: string, s: string, skipVal: number, append = false) => {
    if (!append) setLoading(true)
    setError('')
    try {
      const params: Record<string, string> = { date: d, skip: String(skipVal), limit: String(PAGE_SIZE) }
      if (source && source !== 'all') params.source = source
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
    fetchArticles(date, sourceFilter, search, 0)
  }, [date, sourceFilter, search, fetchArticles])

  const handleSearch = () => {
    setSearch(searchInput)
    setSkip(0)
  }

  const handleLoadMore = () => {
    const newSkip = skip + PAGE_SIZE
    setSkip(newSkip)
    setLoadingMore(true)
    fetchArticles(date, sourceFilter, search, newSkip, true)
  }

  const sources = Array.from(new Set(
    articles.map((a) => a.source).concat(sourceFilter !== 'all' ? [sourceFilter] : [])
  ))

  return (
    <div>
      {/* Hero Section */}
      <Card
        style={{
          marginBottom: 32,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          border: 'none',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
        }}
        styles={{ body: { padding: '48px 40px' } }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={14}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <RocketOutlined style={{ fontSize: 24, color: '#fff' }} />
              </div>
              <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#fff' }}>
                GK Gist
              </Title>
            </div>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 17, display: 'block', lineHeight: 1.6, marginBottom: 20 }}>
              AI-curated current affairs summaries for UPSC preparation. Stay ahead with daily updates from trusted sources.
            </Text>
            <Space size={[8, 12]} wrap>
              <Tag icon={<FireOutlined />} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 500 }}>
                Daily Updates
              </Tag>
              <Tag icon={<TrophyOutlined />} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 500 }}>
                Exam Ready
              </Tag>
              <Tag icon={<StarOutlined />} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 500 }}>
                AI Summarized
              </Tag>
            </Space>
          </Col>
          <Col xs={24} lg={10} style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '8px 8px 8px 20px', backdropFilter: 'blur(10px)' }}>
              <DatePicker
                value={dayjs(date)}
                onChange={(d) => { if (d) setDate(d.format('YYYY-MM-DD')) }}
                allowClear={false}
                suffixIcon={<CalendarOutlined style={{ color: 'rgba(255,255,255,0.9)' }} />}
                size="large"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12 }}
                format="DD MMM YYYY"
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Stats Row */}
      <Row gutter={16} style={{ marginBottom: 28 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 14, textAlign: 'center', background: '#141416', border: '1px solid #27272a', transition: 'all 0.3s' }} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic
              title={<Text style={{ color: '#a1a1aa', fontSize: 13, fontWeight: 500 }}>Total Articles</Text>}
              value={total}
              prefix={<BookOutlined style={{ color: '#6366f1' }} />}
              valueStyle={{ fontWeight: 700, color: '#fafafa', fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 14, textAlign: 'center', background: '#141416', border: '1px solid #27272a', transition: 'all 0.3s' }} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic
              title={<Text style={{ color: '#a1a1aa', fontSize: 13, fontWeight: 500 }}>Sources</Text>}
              value={sources.filter(s => s !== 'all').length}
              prefix={<FireOutlined style={{ color: '#f59e0b' }} />}
              valueStyle={{ fontWeight: 700, color: '#fafafa', fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 14, textAlign: 'center', background: '#141416', border: '1px solid #27272a', transition: 'all 0.3s' }} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic
              title={<Text style={{ color: '#a1a1aa', fontSize: 13, fontWeight: 500 }}>Date</Text>}
              value={dayjs(date).format('DD MMM')}
              prefix={<CalendarOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ fontWeight: 700, color: '#fafafa', fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 14, textAlign: 'center', background: '#141416', border: '1px solid #27272a', transition: 'all 0.3s' }} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic
              title={<Text style={{ color: '#a1a1aa', fontSize: 13, fontWeight: 500 }}>Status</Text>}
              value={loading ? 'Loading' : 'Ready'}
              prefix={<ClockCircleOutlined style={{ color: loading ? '#f59e0b' : '#10b981' }} />}
              valueStyle={{ fontWeight: 700, color: loading ? '#f59e0b' : '#10b981', fontSize: 24 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 28, borderRadius: 14, background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '20px 24px' } }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={14}>
            <Space size={10} wrap>
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
                size="middle"
                style={{ background: '#0a0a0b', padding: 4, borderRadius: 10 }}
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
              size="middle"
              style={{ width: '100%' }}
              prefix={<SearchOutlined style={{ color: '#a1a1aa' }} />}
              enterButton={<Button type="primary" icon={<SearchOutlined />}>Search</Button>}
            />
          </Col>
        </Row>
      </Card>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map((i) => <ArticleCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <Card style={{ borderRadius: 14, background: '#1c1c1f', border: '1px solid #ef4444' }} styles={{ body: { padding: '20px 24px' } }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FireOutlined style={{ color: '#ef4444', fontSize: 20 }} />
            </div>
            <Text style={{ color: '#fca5a5', fontSize: 15 }}>{error}</Text>
          </div>
        </Card>
      ) : articles.length === 0 ? (
        <Card style={{ borderRadius: 16, padding: '80px 24px', textAlign: 'center', background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '80px 24px' } }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: '#1c1c1f', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <BookOutlined style={{ fontSize: 32, color: '#71717a' }} />
          </div>
          <Title level={4} style={{ margin: 0, marginBottom: 8, color: '#d4d4d8' }}>
            {search ? 'No articles match your search' : `No articles found for ${date}`}
          </Title>
          <Text style={{ color: '#a1a1aa', fontSize: 14 }}>
            {search ? 'Try adjusting your search terms' : 'Try selecting a different date or source'}
          </Text>
        </Card>
      ) : (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {total > articles.length && (
            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <Button
                onClick={handleLoadMore}
                loading={loadingMore}
                size="large"
                style={{ fontWeight: 600, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none', padding: '0 36px', height: 48, fontSize: 15 }}
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
