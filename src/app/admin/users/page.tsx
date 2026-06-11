'use client'

import { useEffect, useState, useCallback } from 'react'
import { Typography, Table, Tag, Button, Input, Switch, Space, message, Card, Row, Col, Statistic } from 'antd'
import { UserOutlined, UsergroupAddOutlined, SafetyOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
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

  const adminCount = users.filter(u => u.is_admin).length
  const userCount = users.filter(u => !u.is_admin).length

  return (
    <div>
      <Card style={{ marginBottom: 24, borderRadius: 16, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: '24px 28px' } }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px', fontWeight: 700, color: 'var(--color-text)' }}>
              User Management
            </Title>
            <Text style={{ color: 'var(--color-text-secondary)', fontSize: 14, display: 'block', marginTop: 4 }}>
              Manage user roles and permissions
            </Text>
          </Col>
          <Col>
            <Space size={24}>
              <Statistic
                title={<Text style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>Total Users</Text>}
                value={total}
                prefix={<UsergroupAddOutlined style={{ color: '#6366f1' }} />}
                valueStyle={{ fontWeight: 700, color: 'var(--color-text)' }}
              />
              <Statistic
                title={<Text style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>Admins</Text>}
                value={adminCount}
                prefix={<SafetyOutlined style={{ color: '#f59e0b' }} />}
                valueStyle={{ fontWeight: 700, color: 'var(--color-text)' }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginBottom: 16, borderRadius: 12, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: '16px 20px' } }}>
        <Row gutter={12} align="middle">
          <Col flex="auto">
            <Input.Search
              placeholder="Search users..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              size="middle"
              style={{ width: 280 }}
            />
          </Col>
          <Col>
            <Button icon={<UserOutlined />} disabled size="middle" type="default">
              Add User (via auth)
            </Button>
          </Col>
        </Row>
      </Card>

      {error && (
        <Card style={{ marginBottom: 16, borderRadius: 12, background: 'var(--color-surface)', border: '1px solid #ef4444' }} styles={{ body: { padding: '12px 16px' } }}>
          <Text style={{ color: '#fca5a5' }}>{error}</Text>
        </Card>
      )}

      <Card style={{ borderRadius: 12, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={users}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              width: 160,
              render: (text: string | null) => text ? <Text style={{ color: 'var(--color-text)' }}>{text}</Text> : <Text style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>No name</Text>,
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
              width: 220,
              render: (text: string) => <Text style={{ color: '#d4d4d8' }}>{text}</Text>,
            },
            {
              title: 'Role',
              dataIndex: 'is_admin',
              key: 'is_admin',
              width: 140,
              render: (isAdmin: boolean, record: UserData) => (
                <Space>
                  <Tag color={isAdmin ? 'purple' : 'default'}>{isAdmin ? 'Admin' : 'User'}</Tag>
                  <Switch
                    checked={isAdmin}
                    onChange={(checked) => handleToggleRole(record.id, checked)}
                    size="small"
                  />
                </Space>
              ),
            },
            {
              title: 'Created',
              dataIndex: 'created_at',
              key: 'created_at',
              width: 150,
              render: (d: string) => (
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  {dayjs(d).format('DD-MM-YYYY')}
                </span>
              ),
            },
          ]}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 20, showSizeChanger: false }}
          locale={{ emptyText: 'No users found' }}
          size="middle"
        />
      </Card>
    </div>
  )
}
