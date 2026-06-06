'use client'

import { useEffect, useState, useCallback } from 'react'
import { Typography, DatePicker, Table, Tag, Button, Spin, message, Tooltip, Space } from 'antd'
import { ReloadOutlined, ThunderboltOutlined, LinkOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'
import FormattedSummary from '@/components/FormattedSummary'
import dayjs from 'dayjs'

const { Title, Text, Paragraph } = Typography

interface ArticleWithSummary {
  id: string
  headline: string
  url: string
  published_at: string
  source: string
  gk_summary: string | null
  key_terms: string[] | null
  syllabus_tag: string | null
  scraped_at: string | null
  image_url: string | null
  body_text?: string
}

const SOURCE_COLORS: Record<string, string> = {
  thehindu: 'blue',
  indianexpress: 'orange',
}
const SOURCE_LABELS: Record<string, string> = {
  thehindu: 'The Hindu',
  indianexpress: 'The Indian Express',
}

const SOURCES = ['thehindu', 'indianexpress']

export default function SummariesPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [articles, setArticles] = useState<ArticleWithSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<Set<string>>(new Set())

  const fetchArticles = useCallback(async (d: string) => {
    setLoading(true)
    try {
      const results = await Promise.all(
        SOURCES.map((s) => api.getScrapeArticles(s, d).then(r => ({
          source: s,
          articles: (r.articles || []).map((a: any) => ({ ...a, source: s })),
        })).catch(() => ({ source: s, articles: [] })))
      )
      const all = results.flatMap(r => r.articles)
      all.sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      setArticles(all)
    } catch {
      message.error('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchArticles(date) }, [date, fetchArticles])

  const handleGenerate = async (id: string) => {
    setProcessing(prev => new Set(prev).add(id))
    try {
      const result = await api.generateSummaries([id])
      if (result.updated > 0) {
        message.success('Summary generated')
        await fetchArticles(date)
      } else {
        message.error(result.errors?.[0] || 'Generation failed')
      }
    } catch (err: any) {
      message.error(err?.message || 'Failed')
    } finally {
      setProcessing(prev => { const next = new Set(prev); next.delete(id); return next })
    }
  }

  const handleGenerateAll = async () => {
    const ids = articles.filter(a => !a.gk_summary).map(a => a.id)
    if (ids.length === 0) {
      message.info('All articles already have summaries')
      return
    }
    setProcessing(new Set(ids))
    try {
      const result = await api.generateSummaries(ids)
      message.success(`Generated ${result.updated} summaries`)
      await fetchArticles(date)
    } catch (err: any) {
      message.error(err?.message || 'Failed')
    } finally {
      setProcessing(new Set())
    }
  }

  const hasSummary = (a: ArticleWithSummary) => a.gk_summary && a.gk_summary.length > 0
  const articlesWithoutSummary = articles.filter(a => !hasSummary(a))

  const expandedRowRender = (record: ArticleWithSummary) => (
    <div style={{ padding: '8px 12px 12px' }}>
      {record.image_url && (
        <img
          src={record.image_url}
          alt=""
          style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 4, marginBottom: 12 }}
        />
      )}
      <div style={{ marginBottom: 8 }}>
        <a
          href={record.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}
        >
          {record.headline}
          <LinkOutlined style={{ marginLeft: 6, color: '#999', fontSize: 13 }} />
        </a>
      </div>

      {record.gk_summary ? (
        <div style={{ fontSize: 13, lineHeight: 1.6, color: '#424242' }}>
          <FormattedSummary summary={record.gk_summary} />
        </div>
      ) : (
        <Text type="secondary">No summary generated yet.</Text>
      )}

      {record.key_terms && record.key_terms.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {record.key_terms.map((t: string) => (
            <Tag key={t} style={{ fontSize: 11, marginBottom: 2 }}>{t}</Tag>
          ))}
        </div>
      )}
    </div>
  )

  const columns = [
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (s: string) => <Tag color={SOURCE_COLORS[s] || 'default'}>{SOURCE_LABELS[s] || s}</Tag>,
    },
    {
      title: 'Headline',
      dataIndex: 'headline',
      key: 'headline',
      ellipsis: true,
      render: (h: string, record: ArticleWithSummary) => (
        <a href={record.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500, fontSize: 13 }}>
          {h}
        </a>
      ),
    },
    {
      title: 'Summary',
      dataIndex: 'gk_summary',
      key: 'gk_summary',
      width: 200,
      ellipsis: true,
      render: (s: string | null) => {
        if (!s) return <Tag color="warning" style={{ fontSize: 11 }}>Not generated</Tag>
        return <Text style={{ fontSize: 12, color: '#666' }}>{s.slice(0, 120)}{s.length > 120 ? '...' : ''}</Text>
      },
    },
    {
      title: 'Syllabus',
      dataIndex: 'syllabus_tag',
      key: 'syllabus_tag',
      width: 130,
      render: (t: string | null) => t
        ? <Tag style={{ fontSize: 10, whiteSpace: 'normal', lineHeight: 1.3 }}>{t.split(':')[0]}</Tag>
        : <Text type="secondary">—</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      width: 110,
      render: (_: any, record: ArticleWithSummary) => {
        const busy = processing.has(record.id)
        return (
          <Button
            size="small"
            type={hasSummary(record) ? 'default' : 'primary'}
            icon={<ThunderboltOutlined />}
            loading={busy}
            disabled={processing.size > 0 && !busy}
            onClick={(e) => { e.stopPropagation(); handleGenerate(record.id) }}
          >
            {hasSummary(record) ? 'Regen' : 'Generate'}
          </Button>
        )
      },
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Space size={16}>
          <Title level={4} style={{ margin: 0, letterSpacing: '-0.5px', color: '#1a1a1a' }}>
            Summaries
          </Title>
          <DatePicker
            value={dayjs(date)}
            onChange={(d) => { if (d) setDate(d.format('YYYY-MM-DD')) }}
            allowClear={false}
            size="small"
            style={{ width: 140 }}
          />
        </Space>
        <Space size={8}>
          {articlesWithoutSummary.length > 0 && (
            <Button
              icon={<ThunderboltOutlined />}
              onClick={handleGenerateAll}
              loading={processing.size === articlesWithoutSummary.length && processing.size > 0}
              disabled={processing.size > 0 && processing.size < articlesWithoutSummary.length}
              size="small"
            >
              Generate All ({articlesWithoutSummary.length})
            </Button>
          )}
          <Button icon={<ReloadOutlined />} onClick={() => fetchArticles(date)} loading={loading} size="small">
            Refresh
          </Button>
        </Space>
      </div>

      <div style={{ marginBottom: 8, display: 'flex', gap: 16 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Articles: {articles.length}
          {articles.filter(a => hasSummary(a)).length > 0 && (
            <> · With summary: {articles.filter(a => hasSummary(a)).length}</>
          )}
          {articlesWithoutSummary.length > 0 && (
            <> · Without: {articlesWithoutSummary.length}</>
          )}
        </Text>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <Table
          dataSource={articles}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="small"
          locale={{ emptyText: 'No articles found for this date' }}
          expandable={{
            expandedRowRender,
            rowExpandable: () => true,
          }}
        />
      </div>
    </div>
  )
}
