'use client'

import { useEffect, useState, useCallback } from 'react'
import { Typography, DatePicker, Table, Tag, Button, Space, Popconfirm, message } from 'antd'
import { DeleteOutlined, ReloadOutlined, LinkOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'
import FormattedSummary from '@/components/FormattedSummary'
import dayjs from 'dayjs'

const { Title, Text } = Typography

interface ArticleData {
  id: string
  source: string
  headline: string
  url: string
  published_at: string
  gk_summary: string | null
  key_terms: string[] | null
  syllabus_tag: string | null
}

const SOURCES = ['thehindu', 'indianexpress']
const SOURCE_LABELS: Record<string, string> = {
  thehindu: 'The Hindu',
  indianexpress: 'The Indian Express',
}

export default function AdminArticlesPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [articles, setArticles] = useState<ArticleData[]>([])
  const [loading, setLoading] = useState(true)

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

  const handleDelete = async (id: string) => {
    try {
      await api.adminDeleteArticle(id)
      setArticles(prev => prev.filter(a => a.id !== id))
      message.success('Article deleted')
    } catch {
      message.error('Failed to delete article')
    }
  }

  const expandedRowRender = (record: ArticleData) => (
    <div style={{ padding: '8px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
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
        <FormattedSummary summary={record.gk_summary} />
      ) : (
        <Tag color="warning" style={{ fontSize: 11 }}>No summary</Tag>
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
      title: 'Headline',
      dataIndex: 'headline',
      key: 'headline',
      ellipsis: true,
      render: (text: string, record: ArticleData) => (
        <a href={record.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500, fontSize: 13 }}>
          {text}
        </a>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      width: 110,
      render: (s: string) => <Tag color={s === 'thehindu' ? 'blue' : 'orange'}>{SOURCE_LABELS[s] || s}</Tag>,
    },
    {
      title: 'Date',
      dataIndex: 'published_at',
      key: 'published_at',
      width: 110,
      render: (d: string) => (
        <span style={{ fontSize: 12 }}>
          {new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 90,
      render: (_: any, record: ArticleData) => (
        <Popconfirm
          title="Delete this article?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger size="small" icon={<DeleteOutlined />}>Delete</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Space size={16}>
          <Title level={4} style={{ margin: 0, letterSpacing: '-0.5px' }}>Articles</Title>
          <DatePicker
            value={dayjs(date)}
            onChange={(d) => { if (d) setDate(d.format('YYYY-MM-DD')) }}
            allowClear={false}
            size="small"
            style={{ width: 140 }}
          />
        </Space>
        <Button icon={<ReloadOutlined />} onClick={() => fetchArticles(date)} loading={loading} size="small">
          Refresh
        </Button>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
        Articles for {date} · {articles.length} total
      </Text>

      <div style={{ overflowX: 'auto' }}>
        <Table
          dataSource={articles}
          columns={columns}
          rowKey="id"
          loading={loading}
          expandable={{ expandedRowRender, rowExpandable: () => true }}
          pagination={{ pageSize: 20, showSizeChanger: false }}
          locale={{ emptyText: 'No articles for this date' }}
          size="small"
        />
      </div>
    </div>
  )
}
