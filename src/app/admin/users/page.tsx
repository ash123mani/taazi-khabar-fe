'use client'

import { useEffect, useState, useCallback } from 'react'
import { Typography, Table, Tag, Button, Spin, Input, Popconfirm, Switch, Space, message } from 'antd'
import { UserOutlined, EditOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'

const { Title, Text } = Typography

interface UserData {
  id: string
  email: string
  name: string | null
  is_admin: boolean
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (search) params['search'] = search
      
      const data = await api.adminGetUsers(params)
      setUsers(data.users || [])
      setTotal(data.total || 0)
    } catch (err: any) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const handleToggleRole = async (id: string, checked: boolean) => {
    try {
      await api.adminUpdateUserRole(id, { is_admin: checked })
    } catch (err: any) {
      message.error(err?.message || 'Failed to update role')
      fetchUsers()
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Title level={4} style={{ margin: 0, letterSpacing: '-0.5px' }}>User Management</Title>
        <Space style={{ display: 'flex', gap: 8 }}>
          <Input.Search
            placeholder="Search users..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            size="middle"
            style={{ width: 220 }}
          />
          <Button
            icon={<UserOutlined />}
            onClick={() => {
              // Could add create user functionality here if needed
            }}
            size="small"
            disabled
          >
            Add User (via auth)
          </Button>
        </Space>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Manage user roles and permissions
      </Text>

      {error && <div style={{ padding: '8px 12px', border: '1px solid #c62828', borderRadius: 4, background: '#ffebee', color: '#c62828', marginBottom: 16 }}>{error}</div>}

      <Table
        dataSource={users}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 140,
            render: (text: string | null) => text || <span style={{ opacity: 0.5, fontStyle: 'italic' }}>No name</span>,
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
          },
          {
            title: 'Role',
            dataIndex: 'is_admin',
            key: 'is_admin',
            width: 100,
            render: (isAdmin: boolean, record: UserData) => (
              <Space>
                <Tag color={isAdmin ? 'purple' : 'default'}>{isAdmin ? 'Admin' : 'User'}</Tag>
                <Switch
                  checked={isAdmin}
                  onChange={(checked) => handleToggleRole(record.id, checked)}
                  disabled={false}
                  size="small"
                />
              </Space>
            ),
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
        ]}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20, showSizeChanger: false }}
        locale={{ emptyText: 'No users found' }}
        size="small"
      />
    </div>
  )
}
