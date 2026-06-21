'use client'

import { useEffect, useState, useCallback } from 'react'
import { Typography, Input, DatePicker, Tabs } from 'antd'
import { CalendarOutlined, SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { api } from '@/lib/api'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Article } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'
import { ArticleSkeleton } from '@/components/Skeletons'

const { Text } = Typography

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
    } catch (err) {
      console.error('Failed to fetch counts:', err)
    }
  }, [])

  useEffect(() => { fetchCounts(date, sourceFilter) }, [date, sourceFilter, fetchCounts])

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
      if (append) setArticles(prev => [...prev, ...list])
      else setArticles(list)
      setTotal(totalCount)
    } catch { setError('Failed to load articles') }
    finally { setLoading(false); setLoadingMore(false) }
  }, [])

  useEffect(() => {
    setSkip(0)
    fetchArticles(date, sourceFilter, categoryFilter, search, 0)
  }, [date, sourceFilter, categoryFilter, search, fetchArticles])

  const handleSearch = () => { setSearch(searchInput); setSkip(0) }

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
        <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: categoryFilter === 'all' ? 700 : 400 }}>
          All
          <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--color-text-tertiary)' }}>({catTotal})</span>
        </span>
      ),
    },
    ...categories.map((c) => ({
      key: c.id,
      label: (
        <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: categoryFilter === c.id ? 700 : 400 }}>
          {c.name}
          <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--color-text-tertiary)' }}>
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
        borderBottom: '1px solid var(--color-border-light)',
        paddingBottom: isMobile ? 8 : 12,
        marginBottom: isMobile ? 8 : 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <div className="newspaper-heading" style={{
            fontWeight: 800,
            fontSize: isMobile ? 20 : 26,
            letterSpacing: '-0.3px',
            color: 'var(--color-text)',
            lineHeight: 1.15,
          }}>
            {dayjs(date).format('D MMMM')} Briefings
          </div>
          <DatePicker
            value={dayjs(date)}
            onChange={(d) => { if (d) setDate(d.format('YYYY-MM-DD')) }}
            allowClear={false}
            format="DD-MM-YYYY"
            disabledDate={(current) => {
              if (!current) return false
              return current.isBefore(dayjs('2026-06-07')) || current.isAfter(dayjs())
            }}
            suffixIcon={<CalendarOutlined style={{ fontSize: isMobile ? 10 : 12, color: 'var(--color-text-tertiary)' }} />}
            size="small"
            style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 2, fontSize: 11 }}
          />
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 49,
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border-light)',
          marginBottom: isMobile ? 6 : 10,
        }}
      >
        {/* Source tabs */}
        <Tabs
          activeKey={sourceFilter}
          onChange={(key) => { setSourceFilter(key); setCategoryFilter('all') }}
          items={(['all', 'thehindu', 'indianexpress', 'pib'] as const).map((key) => ({
            key,
            label: (
              <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: sourceFilter === key ? 700 : 400 }}>
                {SOURCE_META[key].label}
                {(counts as any)[key] != null && (
                  <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--color-text-tertiary)' }}>{(counts as any)[key]}</span>
                )}
              </span>
            ),
          }))}
          size="small"
          style={{ marginBottom: 0 }}
          tabBarStyle={{ marginBottom: 0, borderBottom: 'none' }}
        />

        {/* Category tabs */}
        {categories.length > 0 && (
          <Tabs
            activeKey={categoryFilter}
            onChange={setCategoryFilter}
            items={tabItems}
            size="small"
            style={{ marginBottom: 0 }}
            tabBarStyle={{ marginBottom: 0, borderBottom: 'none' }}
          />
        )}

        {/* Search */}
        <div style={{
          borderTop: '1px solid var(--color-border-light)',
          padding: '2px 0',
        }}>
          <Input.Search
            placeholder="Search articles..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={handleSearch}
            onClear={() => { setSearchInput(''); setSearch(''); setSkip(0); fetchArticles(date, sourceFilter, categoryFilter, '', 0) }}
            allowClear
            size="small"
            variant="borderless"
            prefix={<SearchOutlined style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }} />}
            style={{ height: isMobile ? 30 : 34 }}
          />
        </div>
      </div>



      {/* Content */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              borderBottom: '1px solid var(--color-border-light)',
              borderRight: !isMobile && i % 2 === 1 ? '1px solid var(--color-border-light)' : 'none',
              padding: isMobile ? '8px 0' : '12px 12px',
            }}>
              <ArticleSkeleton hasImage={isMobile ? true : i % 2 === 0} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={{ padding: '24px 12px', textAlign: 'center' }}>
          <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>
        </div>
      ) : articles.length === 0 ? (
        <div style={{ padding: isMobile ? '32px 12px' : '48px 16px', textAlign: 'center' }}>
          <div className="newspaper-heading" style={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            {search ? 'No articles match your search' : `No articles for ${dayjs(date).format('DD-MM-YYYY')}`}
          </div>
          <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>
            {search ? 'Try different keywords' : 'Select another date or source'}
          </Text>
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0 }}>
            {articles.map((article, idx) => (
              <div key={article.id} style={{
                borderBottom: '1px solid var(--color-border-light)',
                borderRight: !isMobile && idx % 2 === 0 ? '1px solid var(--color-border-light)' : 'none',
                padding: isMobile ? '8px 0' : '10px 12px',
              }}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
          {total > articles.length && (
            <div style={{ textAlign: 'center', marginTop: isMobile ? 16 : 20 }}>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                style={{
                  padding: '6px 24px',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  border: '1px solid var(--color-border)',
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                  background: 'transparent',
                  color: 'var(--color-text-tertiary)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface)'; e.currentTarget.style.color = 'var(--color-text)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-tertiary)' }}
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
