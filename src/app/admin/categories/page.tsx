'use client'

import { useEffect, useState, useCallback } from 'react'
import { Typography, Table, Tag, Button, Spin, Input, Modal, Form, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
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

  const handleCreate = async (values: { name: string; description: string | null }) => {
    try {
      await api.adminCreateCategory(values)
      setShowForm(false)
      form.resetFields()
      await fetchCategories()
    } catch (err: any) {
      // Error handled by form
    }
  }

  const handleUpdate = async () => {
    if (!editingId) return
    try {
      const values = form.getFieldsValue()
      await api.adminUpdateCategory(editingId, values)
      setEditingId(null)
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Title level={4} style={{ margin: 0, letterSpacing: '-0.5px' }}>Category Management</Title>
        <Space style={{ display: 'flex', gap: 8 }}>
          <Input.Search
            placeholder="Search categories..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            size="middle"
            style={{ width: 200 }}
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setShowForm(true)
              form.resetFields()
            }}
            size="small"
          >
            Add Category
          </Button>
        </Space>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Manage UPSC syllabus categories
      </Text>

      {error && <div style={{ padding: 12, border: '1px solid var(--ant-color-error)', marginBottom: 16 }}>{error}</div>}

      <Modal
        title={editingId ? 'Edit Category' : 'Add Category'}
        open={!!showForm}
        onOk={() => (editingId ? handleUpdate() : handleCreate())}
        onCancel={() => { setShowForm(false); form.resetFields() }}
        okText={editingId ? 'Save' : 'Create'}
        cancelText="Cancel"
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          name="category_form"
          onFinish={editingId ? handleUpdate : handleCreate}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input category name!' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea rows={4} placeholder="Enter description (optional)" />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        dataSource={categories}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text: string | null) => text || <span style={{ opacity: 0.5, fontStyle: 'italic' }}>No description</span>,
          },
          {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 140,
            render: (d: string) => (
              <span style={{ fontSize: 12 }}>
                {new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            ),
          },
          {
            title: 'Action',
            key: 'action',
            width: 120,
            render: (_: any, record: CategoryData) => (
              <Space direction="vertical" style={{ textAlign: 'center' }}>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => {
                    form.setFieldsValue({
                      name: record.name,
                      description: record.description,
                    })
                    setEditingId(record.id)
                    setShowForm(true)
                  }}
                  style={{ marginBottom: 4 }}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Delete this category?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
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
        size="small"
      />
    </div>
  )
}
