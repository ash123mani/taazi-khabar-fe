'use client'

import { useEffect, useState } from 'react'
import { Typography, Table, Tag, Space, Button, message, Card, Input, Popconfirm } from 'antd'
import { api } from '@/lib/api'
import type { Article } from '@/lib/types'
import dayjs from 'dayjs'

const { Title } = Typography
const { Search } = Input

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const data = await api.getArticles({ date })
      setArticles(data)
    } catch (err: any) {
      message.error(err.message || 'Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [date])

  const handleDelete = async (id: string) => {
    try {
      await api.deleteArticle(id)
      message.success('Article deleted successfully')
      fetchArticles()
    } catch (err: any) {
      message.error(err.message || 'Failed to delete article')
    }
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = !search ||
      article.headline?.toLowerCase().includes(search.toLowerCase()) ||
      article.source?.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  const columns = [
    {
      title: 'Title',
      dataIndex: 'headline',
      key: 'headline',
      render: (text: string) => <span style={{ color: '#ffffff', fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (text: string) => <span style={{ color: '#a1a1a1' }}>{text}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'published_at',
      key: 'published_at',
      render: (date: string) => <span style={{ color: '#6b6b6b' }}>{new Date(date).toLocaleDateString('en-IN')}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Article) => (
        <Space>
          <Button size="small" type="default" style={{ fontWeight: 600, borderRadius: 6 }}>Edit</Button>
          <Popconfirm
            title="Delete article"
            description="Are you sure you want to delete this article?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" style={{ borderRadius: 6 }}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16, color: '#ffffff' }}>Article Management</Title>
      <Card style={{ background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: 12 }} styles={{ body: { padding: 18 } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <Space>
            <Search
              placeholder="Search articles..."
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
          </Space>
          <Button onClick={fetchArticles} type="default" style={{ fontWeight: 600, borderRadius: 8 }}>Refresh</Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredArticles}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => <span style={{ color: '#6b6b6b' }}>Total {total} articles</span>,
          }}
          onChange={(p) => setPagination({ current: p.current || 1, pageSize: p.pageSize || 10 })}
        />
      </Card>
    </div>
  )
}
