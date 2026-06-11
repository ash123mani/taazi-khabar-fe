'use client'

import { useEffect, useState } from 'react'
import { Typography, Table, Space, Button, message, Card, Input, Popconfirm } from 'antd'
import { api } from '@/lib/api'
import type { Category } from '@/lib/types'

const { Title } = Typography
const { Search } = Input

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await api.getCategories()
      setCategories(data?.categories || data || [])
    } catch (err: any) {
      message.error(err.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCategory(id)
      message.success('Category deleted successfully')
      fetchCategories()
    } catch (err: any) {
      message.error(err.message || 'Failed to delete category')
    }
  }

  const filteredCategories = categories.filter((category) => {
    return !search || category.name?.toLowerCase().includes(search.toLowerCase())
  })

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <span style={{ color: 'var(--color-text-secondary)' }}>{text || 'N/A'}</span>,
    },
    {
      title: 'Articles',
      dataIndex: 'article_count',
      key: 'article_count',
      render: (count: number) => <span style={{ color: 'var(--color-text-secondary)' }}>{count || 0}</span>,
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => <span style={{ color: 'var(--color-text-tertiary)' }}>{new Date(date).toLocaleDateString('en-IN')}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Category) => (
        <Space>
          <Button size="small" type="default" style={{ fontWeight: 600, borderRadius: 6 }}>Edit</Button>
          <Popconfirm
            title="Delete category"
            description="Are you sure you want to delete this category?"
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
      <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16, color: 'var(--color-text)' }}>Category Management</Title>
      <Card style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }} styles={{ body: { padding: 18 } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <Search
            placeholder="Search categories..."
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Button onClick={fetchCategories} type="default" style={{ fontWeight: 600, borderRadius: 8 }}>Refresh</Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredCategories}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => <span style={{ color: 'var(--color-text-tertiary)' }}>Total {total} categories</span>,
          }}
          onChange={(p) => setPagination({ current: p.current || 1, pageSize: p.pageSize || 10 })}
        />
      </Card>
    </div>
  )
}
