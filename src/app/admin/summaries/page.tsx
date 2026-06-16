'use client'

import { useEffect, useState, useCallback } from 'react'
import { Typography, DatePicker, Table, Tag, Button, Spin, message, Tooltip, Space, Card, Row, Col, Statistic } from 'antd'
import { ReloadOutlined, ThunderboltOutlined, LinkOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
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
  pib: 'green',
}
const SOURCE_LABELS: Record<string, string> = {
  thehindu: 'The Hindu',
  indianexpress: 'The Indian Express',
  pib: 'PIB',
}

const SOURCES = ['thehindu', 'indianexpress', 'pib']

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
  const withSummaryCount = articles.filter(a => hasSummary(a)).length

  const expandedRowRender = (record: ArticleWithSummary) => (
    <div style={{ padding: '8px 12px 12px' }}>
      {record.image_url && (
        <img
          src={record.image_url}
          alt=""
          style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
        />
      )}
      <div style={{ marginBottom: 8 }}>
        <a
          href={record.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 15, fontWeight: 600, color: '#818cf8' }}
        >
          {record.headline}
          <LinkOutlined style={{ marginLeft: 6, fontSize: 13, color: '#6366f1' }} />
        </a>
      </div>

      {record.gk_summary ? (
        <div style={{ fontSize: 13, lineHeight: 1.6 }}>
          <FormattedSummary summary={record.gk_summary} />
        </div>
      ) : (
        <Text style={{ color: 'var(--color-text-tertiary)' }}>No summary generated yet.</Text>
      )}

      {record.key_terms && record.key_terms.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {record.key_terms.map((t: string) => (
            <Tag key={t} style={{ fontSize: 11, marginBottom: 2, background: 'var(--color-border)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>{t}</Tag>
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
      render: (s: string) => {
        const bg: Record<string, string> = { thehindu: '#3b82f6', indianexpress: '#f97316', pib: '#22c55e' }
        return <Tag color={SOURCE_COLORS[s] || 'default'} style={{ background: bg[s] || '#6b7280', color: '#fff', border: 'none' }}>{SOURCE_LABELS[s] || s}</Tag>
      },
    },
    {
      title: 'Headline',
      dataIndex: 'headline',
      key: 'headline',
      ellipsis: true,
      render: (h: string, record: ArticleWithSummary) => (
        <a href={record.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500, fontSize: 13, color: '#fafafa' }}>
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
        if (!s) return <Tag color="warning" style={{ fontSize: 11, background: '#f59e0b', color: '#fff', border: 'none' }}>Not generated</Tag>
        return <Text style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{s.slice(0, 120)}{s.length > 120 ? '...' : ''}</Text>
      },
    },
    {
      title: 'Syllabus',
      dataIndex: 'syllabus_tag',
      key: 'syllabus_tag',
      width: 130,
      render: (t: string | null) => t
        ? <Tag style={{ fontSize: 10, whiteSpace: 'normal', lineHeight: 1.3, background: 'var(--color-border)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>{t.split(':')[0]}</Tag>
        : <Text style={{ color: 'var(--color-text-tertiary)' }}>—</Text>,
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
            style={hasSummary(record) ? { background: 'var(--color-border)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' } : { background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none' }}
          >
            {hasSummary(record) ? 'Regen' : 'Generate'}
          </Button>
        )
      },
    },
  ]

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: 24, borderRadius: 16, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: '24px 28px' } }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px', fontWeight: 700, color: '#fafafa' }}>
              Summaries
            </Title>
            <Text style={{ color: 'var(--color-text-secondary)', fontSize: 14, display: 'block', marginTop: 4 }}>
              Review and manage AI-generated summaries
            </Text>
          </Col>
          <Col>
            <Space size={24}>
              <Statistic
                title={<Text style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>Total</Text>}
                value={articles.length}
                prefix={<FileTextOutlined style={{ color: '#6366f1' }} />}
                valueStyle={{ fontWeight: 700, color: '#fafafa' }}
              />
              <Statistic
                title={<Text style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>With Summary</Text>}
                value={withSummaryCount}
                prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
                valueStyle={{ fontWeight: 700, color: '#fafafa' }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Controls */}
      <Card style={{ marginBottom: 16, borderRadius: 12, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: '16px 20px' } }}>
        <Row gutter={12} align="middle" style={{ marginBottom: 12 }}>
          <Col>
            <DatePicker
              value={dayjs(date)}
              onChange={(d) => { if (d) setDate(d.format('YYYY-MM-DD')) }}
              allowClear={false}
              format="DD-MM-YYYY"
              size="middle"
              style={{ width: 140 }}
            />
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={() => fetchArticles(date)} loading={loading} size="middle">
              Refresh
            </Button>
          </Col>
          {articlesWithoutSummary.length > 0 && (
            <Col>
              <Button icon={<ThunderboltOutlined />} onClick={handleGenerateAll} loading={processing.size === articlesWithoutSummary.length && processing.size > 0} disabled={processing.size > 0 && processing.size < articlesWithoutSummary.length} size="middle" type="primary" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none' }}>
                Generate All ({articlesWithoutSummary.length})
              </Button>
            </Col>
          )}
        </Row>
        <Row>
          <Col>
            <Space size={16}>
              <Text style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                Articles: {articles.length}
                {withSummaryCount > 0 && <> · With summary: {withSummaryCount}</>}
                {articlesWithoutSummary.length > 0 && <> · Without: {articlesWithoutSummary.length}</>}
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 12, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={articles}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="middle"
          locale={{ emptyText: 'No articles found for this date' }}
          expandable={{
            expandedRowRender,
            rowExpandable: () => true,
          }}
        />
      </Card>
    </div>
  )
}
