'use client'

import { useEffect, useState, useCallback } from 'react'
import { Typography, Table, Tag, Button, Spin, Input, Modal, Form, Space, Popconfirm, Card, Row, Col, Statistic } from 'antd'
import { PlusOutlined, TagsOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'

const { Title, Text } = Typography

interface CategoryData {
  id: string
  name: string
  description: string | null
  created_at: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form] = Form.useForm()

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (search) params['search'] = search

      const data = await api.adminGetCategories(params)
      setCategories(data.categories || [])
      setTotal(data.total || 0)
    } catch (err: any) {
      setError(err.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const handleFinish = async () => {
    try {
      const values = await form.validateFields()
      if (editingId) {
        await api.adminUpdateCategory(editingId, values)
        setEditingId(null)
      } else {
        await api.adminCreateCategory(values)
      }
      setShowForm(false)
      form.resetFields()
      await fetchCategories()
    } catch (err: any) {
      // Error handled by form
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.adminDeleteCategory(id)
      setCategories(prev => prev.filter(c => c.id !== id))
      setTotal(prev => prev - 1)
    } catch (err: any) {
      // Error handled by Popconfirm
    }
  }

  return (
    <div>
      {/* Header Card */}
      <Card style={{ marginBottom: 24, borderRadius: 16, background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '24px 28px' } }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px', fontWeight: 700, color: '#fafafa' }}>
              Category Management
            </Title>
            <Text style={{ color: '#a1a1aa', fontSize: 14, display: 'block', marginTop: 4 }}>
              Manage UPSC syllabus categories
            </Text>
          </Col>
          <Col>
            <Statistic
              title={<Text style={{ color: '#a1a1aa', fontSize: 12 }}>Total Categories</Text>}
              value={total}
              prefix={<TagsOutlined style={{ color: '#f59e0b' }} />}
              valueStyle={{ fontWeight: 700, color: '#fafafa' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Search & Actions */}
      <Card style={{ marginBottom: 16, borderRadius: 12, background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '16px 20px' } }}>
        <Row gutter={12} align="middle">
          <Col flex="auto">
            <Input.Search
              placeholder="Search categories..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              size="middle"
              style={{ width: 280 }}
            />
          </Col>
          <Col>
            <Button icon={<PlusOutlined />} onClick={() => { setShowForm(true); form.resetFields() }} size="middle">
              Add Category
            </Button>
          </Col>
        </Row>
      </Card>

      {error && (
        <Card style={{ marginBottom: 16, borderRadius: 12, background: '#1c1c1f', border: '1px solid #ef4444' }} styles={{ body: { padding: '12px 16px' } }}>
          <Text style={{ color: '#fca5a5' }}>{error}</Text>
        </Card>
      )}

      <Modal
        title={editingId ? 'Edit Category' : 'Add Category'}
        open={!!showForm}
        onOk={() => { form.submit() }}
        onCancel={() => { setShowForm(false); setEditingId(null); form.resetFields() }}
        okText={editingId ? 'Save' : 'Create'}
        cancelText="Cancel"
        width={400}
      >
        <Form form={form} layout="vertical" name="category_form" onFinish={handleFinish}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input category name!' }]}>
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Enter description (optional)" />
          </Form.Item>
        </Form>
      </Modal>

      <Card style={{ borderRadius: 12, background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={categories}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: (text: string) => <Text strong style={{ color: '#fafafa' }}>{text}</Text>,
            },
            {
              title: 'Description',
              dataIndex: 'description',
              key: 'description',
              ellipsis: true,
              render: (text: string | null) => text ? <Text style={{ color: '#d4d4d8' }}>{text}</Text> : <Text style={{ color: '#71717a', fontStyle: 'italic' }}>No description</Text>,
            },
            {
              title: 'Created',
              dataIndex: 'created_at',
              key: 'created_at',
              width: 150,
              render: (d: string) => (
                <span style={{ fontSize: 12, color: '#a1a1aa' }}>
                  {new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              ),
            },
            {
              title: 'Action',
              key: 'action',
              width: 160,
              render: (_: any, record: CategoryData) => (
                <Space>
                  <Button size="small" icon={<EditOutlined />} onClick={() => {
                    form.setFieldsValue({ name: record.name, description: record.description })
                    setEditingId(record.id)
                    setShowForm(true)
                  }}>
                    Edit
                  </Button>
                  <Popconfirm title="Delete this category?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
                    <Button danger size="small" icon={<DeleteOutlined />}>
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 20, showSizeChanger: false }}
          locale={{ emptyText: 'No categories found' }}
          size="middle"
        />
      </Card>
    </div>
  )
}
