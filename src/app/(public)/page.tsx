'use client'

import { useEffect, useState, useCallback } from 'react'
import { Typography, Input, DatePicker, Space, Tabs } from 'antd'
import { CalendarOutlined, SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { api } from '@/lib/api'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Article } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'
import { ArticleSkeleton } from '@/components/Skeletons'

const { Title, Text } = Typography

const PAGE_SIZE = 10

const SOURCE_META: Record<string, { label: string; color: string }> = {
  all: { label: 'All', color: '#6366f1' },
  thehindu: { label: 'The Hindu', color: '#3b82f6' },
  indianexpress: { label: 'Indian Express', color: '#f97316' },
  pib: { label: 'PIB', color: '#22c55e' },
}

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

  const catTotal = filteredCounts?.categories
    ? Object.values(filteredCounts.categories).reduce((a: number, b: any) => a + (b as number), 0)
    : 0

  const tabItems = [
    {
      key: 'all',
      label: (
        <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: categoryFilter === 'all' ? 700 : 500, letterSpacing: '0.3px' }}>
          All
          <span style={{ marginLeft: 4, fontSize: 10, fontWeight: 600, color: 'var(--color-text-tertiary)' }}>({catTotal})</span>
        </span>
      ),
    },
    ...categories.map((c) => ({
      key: c.id,
      label: (
        <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: categoryFilter === c.id ? 700 : 500, letterSpacing: '0.3px' }}>
          {c.name}
          <span style={{ marginLeft: 4, fontSize: 10, fontWeight: 600, color: 'var(--color-text-tertiary)' }}>
            ({filteredCounts?.categories?.[c.id] || 0})
          </span>
        </span>
      ),
    })),
  ]

  return (
    <div>
      {/* Masthead */}
      <div style={{
        borderBottom: '2px solid var(--color-border)',
        paddingBottom: isMobile ? 12 : 16,
        marginBottom: isMobile ? 12 : 16,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 8,
        }}>
          <div>
            <Title level={2} style={{
              margin: 0,
              fontWeight: 900,
              fontSize: isMobile ? 20 : 28,
              letterSpacing: '-1px',
              color: 'var(--color-text)',
              lineHeight: 1.1,
            }}>
              Today's Briefing
            </Title>
            <Text style={{
              fontSize: isMobile ? 10 : 12,
              color: 'var(--color-text-tertiary)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}>
              UPSC Current Affairs Digest
            </Text>
          </div>
          <Space size={8} align="center">
            <DatePicker
              value={dayjs(date)}
              onChange={(d) => { if (d) setDate(d.format('YYYY-MM-DD')) }}
              allowClear={false}
              format="DD-MM-YYYY"
              suffixIcon={<CalendarOutlined style={{ fontSize: isMobile ? 10 : 13, color: 'var(--color-text-tertiary)' }} />}
              size={isMobile ? 'small' : 'middle'}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 6,
              }}
            />
          </Space>
        </div>
      </div>

      {/* Source filter */}
      <div style={{
        marginBottom: isMobile ? 8 : 12,
        paddingBottom: isMobile ? 10 : 12,
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {(['all', 'thehindu', 'indianexpress', 'pib'] as const).map((key) => {
            const active = sourceFilter === key
            const meta = SOURCE_META[key]
            return (
              <button
                key={key}
                onClick={() => setSourceFilter(key)}
                style={{
                  padding: isMobile ? '2px 8px' : '3px 10px',
                  fontSize: isMobile ? 10 : 11,
                  fontWeight: active ? 700 : 500,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: 0,
                  cursor: 'pointer',
                  background: 'transparent',
                  color: active ? meta.color : 'var(--color-text-tertiary)',
                  transition: 'all 0.15s',
                }}
              >
                {meta.label}
                {(counts as any)[key] != null && (
                  <span style={{ marginLeft: 3, fontWeight: 400, opacity: 0.7 }}>
                    ({(counts as any)[key]})
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Category tabs */}
      {categories.length > 0 && (
        <div style={{ marginBottom: isMobile ? 8 : 12 }}>
          <Tabs
            activeKey={categoryFilter}
            onChange={setCategoryFilter}
            items={tabItems}
            size={isMobile ? 'small' : 'middle'}
            style={{ marginBottom: 0 }}
            tabBarStyle={{ marginBottom: 0 }}
          />
        </div>
      )}

      {/* Search */}
      <div style={{
        marginBottom: isMobile ? 8 : 12,
        paddingBottom: isMobile ? 10 : 12,
        borderBottom: '1px solid var(--color-border)',
      }}>
        <Input.Search
          placeholder="Search articles..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onSearch={handleSearch}
          onClear={() => { setSearchInput(''); setSearch(''); setSkip(0); fetchArticles(date, sourceFilter, categoryFilter, '', 0) }}
          allowClear
          size="small"
          style={{ width: '100%' }}
          variant="borderless"
          prefix={<SearchOutlined style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }} />}
        />
      </div>

      {/* Article count */}
      {!loading && !error && articles.length > 0 && (
        <div style={{
          marginBottom: isMobile ? 8 : 12,
          textAlign: 'right',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
          fontStyle: 'italic',
        }}>
          {total} article{total !== 1 ? 's' : ''}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 0,
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                borderBottom: '1px solid var(--color-border)',
                borderRight: !isMobile && i % 2 === 1 ? '1px solid var(--color-border)' : 'none',
                padding: isMobile ? '10px 0' : '12px 14px',
              }}
            >
              <ArticleSkeleton hasImage={isMobile ? true : i % 2 === 0} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={{
          padding: isMobile ? '24px 12px' : '32px 16px',
          textAlign: 'center',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <Text style={{ color: '#ef4444', fontSize: 14 }}>{error}</Text>
        </div>
      ) : articles.length === 0 ? (
        <div style={{
          padding: isMobile ? '40px 12px' : '60px 16px',
          textAlign: 'center',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <Title level={4} style={{ margin: 0, marginBottom: 8, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            {search ? 'No articles match your search' : `No articles for ${dayjs(date).format('DD-MM-YYYY')}`}
          </Title>
          <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>
            {search ? 'Try different keywords' : 'Select another date or source'}
          </Text>
        </div>
      ) : (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 0,
          }}>
            {articles.map((article, idx) => (
              <div
                key={article.id}
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  borderRight: !isMobile && idx % 2 === 0 ? '1px solid var(--color-border)' : 'none',
                  padding: isMobile ? '10px 0' : '12px 14px',
                }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
          {total > articles.length && (
            <div style={{ textAlign: 'center', marginTop: isMobile ? 16 : 20, marginBottom: 8 }}>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                style={{
                  padding: '8px 28px',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  border: '1px solid var(--color-border)',
                  borderRadius: 0,
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  transition: 'all 0.15s',
                }}
              >
                {loadingMore ? 'Loading...' : `Load More (${articles.length}/${total})`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
