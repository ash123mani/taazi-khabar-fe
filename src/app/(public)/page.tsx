'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button, Typography, Spin, DatePicker, Segmented, Input, Space } from 'antd'
import { CalendarOutlined, BookOutlined, SearchOutlined } from '@ant-design/icons'
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
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px' }}>
              GK Gist
            </Title>
            <Text style={{ marginTop: 4, display: 'block', color: '#9e9e9e', fontSize: 14 }}>
              AI-curated current affairs summaries for UPSC preparation
            </Text>
          </div>
          <DatePicker
            value={dayjs(date)}
            onChange={(d) => { if (d) setDate(d.format('YYYY-MM-DD')) }}
            allowClear={false}
            suffixIcon={<CalendarOutlined />}
            style={{ width: 150 }}
          />
        </div>

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
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
          <Input.Search
            placeholder="Search articles..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={handleSearch}
            allowClear
            size="small"
            style={{ width: 220 }}
            prefix={<SearchOutlined style={{ color: '#bbb' }} />}
          />
          {!loading && (
            <Text style={{ color: '#bbb', fontSize: 12 }}>
              {total} article{total !== 1 ? 's' : ''}
            </Text>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map((i) => <ArticleCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: 'center', fontSize: 14, color: '#c62828' }}>
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div style={{ padding: 80, textAlign: 'center' }}>
          <BookOutlined style={{ fontSize: 40, color: '#d0d0d0', display: 'block', marginBottom: 16 }} />
          <Text style={{ fontSize: 15, color: '#9e9e9e', display: 'block' }}>
            {search ? 'No articles match your search' : `No articles found for ${date}`}
          </Text>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {total > articles.length && (
            <div style={{ textAlign: 'center', marginTop: 28, marginBottom: 12 }}>
              <Button
                onClick={handleLoadMore}
                loading={loadingMore}
                style={{ fontWeight: 600, minWidth: 140 }}
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
