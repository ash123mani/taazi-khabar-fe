'use client'

import { useEffect, useState, useCallback } from 'react'
import { Typography, Table, Button, Tag, Spin, message } from 'antd'
import { ThunderboltOutlined, ReloadOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'

const { Title, Text } = Typography

interface ArticleBrief {
  id: string
  source: string
  headline: string
  url: string
  published_at: string
}

export default function SummariesPage() {
  const [articles, setArticles] = useState<ArticleBrief[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getArticlesWithoutSummary(0, 100)
      setArticles(data.articles || [])
      setTotal(data.total || 0)
    } catch {
      setError('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchArticles() }, [fetchArticles])

  const handleGenerate = async (id: string) => {
    setGenerating((prev) => new Set(prev).add(id))
    try {
      const result = await api.generateSummaries([id])
      if (result.updated > 0) {
        message.success('Summary generated')
        setArticles((prev) => prev.filter((a) => a.id !== id))
        setTotal((prev) => prev - 1)
      } else {
        message.error(result.errors?.[0] || 'Generation failed')
      }
    } catch (err: any) {
      message.error(err.message || 'Failed to generate summary')
    } finally {
      setGenerating((prev) => { const next = new Set(prev); next.delete(id); return next })
    }
  }

  const handleGenerateAll = async () => {
    const ids = articles.map((a) => a.id)
    if (ids.length === 0) return
    setGenerating(new Set(ids))
    try {
      const result = await api.generateSummaries(ids)
      message.success(`Generated ${result.updated} summaries`)
      await fetchArticles()
    } catch (err: any) {
      message.error(err.message || 'Failed to generate summaries')
    } finally {
      setGenerating(new Set())
    }
  }

  const columns = [
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (s: string) => <Tag style={{ fontWeight: 600 }}>{s.replace('_', ' ')}</Tag>,
    },
    {
      title: 'Headline',
      dataIndex: 'headline',
      key: 'headline',
      ellipsis: true,
    },
    {
      title: 'Published',
      dataIndex: 'published_at',
      key: 'published_at',
      width: 120,
      render: (d: string) => (
        <span style={{ fontSize: 13 }}>
          {new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 140,
      render: (_: any, record: ArticleBrief) => (
        <Button
          size="small"
          type="primary"
          icon={<ThunderboltOutlined />}
          loading={generating.has(record.id)}
          disabled={generating.size > 0}
          onClick={() => handleGenerate(record.id)}
          style={{ fontWeight: 600 }}
        >
          Generate
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Title level={4} style={{
          margin: 0,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Generate Summaries
        </Title>
        <div style={{ display: 'flex', gap: 8 }}>
          {articles.length > 0 && (
            <Button
              icon={<ThunderboltOutlined />}
              onClick={handleGenerateAll}
              loading={generating.size === articles.length && generating.size > 0}
              disabled={generating.size > 0 && generating.size < articles.length}
              style={{ fontWeight: 600 }}
            >
              Generate All ({articles.length})
            </Button>
          )}
          <Button icon={<ReloadOutlined />} onClick={fetchArticles} loading={loading} size="small">
            Refresh
          </Button>
        </div>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        {total} article{total !== 1 ? 's' : ''} without AI summaries
      </Text>

      {error && <div style={{ padding: 12, border: '1px solid var(--ant-color-error)', marginBottom: 16 }}>{error}</div>}

      <Table
        dataSource={articles}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20, showSizeChanger: false }}
        locale={{ emptyText: 'All articles have summaries' }}
        size="small"
      />
    </div>
  )
}
