'use client'

import { useEffect, useState } from 'react'
import { Typography, Table, Tag, Spin, Button, Modal, Input, Tooltip, Card, Row, Col, Statistic, Space } from 'antd'
import { EditOutlined, LikeOutlined, DislikeOutlined, DatabaseOutlined, MessageOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'
import type { AIInteraction } from '@/lib/types'

const { Title, Text } = Typography
const { TextArea } = Input

export default function TrainingDataPage() {
  const [interactions, setInteractions] = useState<AIInteraction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editResponse, setEditResponse] = useState('')

  const fetchInteractions = async () => {
    try {
      const data = await api.getInteractions()
      setInteractions(Array.isArray(data) ? data : data.interactions || [])
    } catch {
      setError('Failed to load interactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchInteractions() }, [])

  const handleFeedback = async (id: string, feedback: number | null) => {
    try {
      await api.updateInteraction(id, { user_feedback: feedback })
      setInteractions((prev) => prev.map((i) => (i.id === id ? { ...i, user_feedback: feedback } : i)))
    } catch { /* ignore */ }
  }

  const handleEdit = async (id: string) => {
    if (!editResponse.trim()) return
    try {
      await api.updateInteraction(id, { response: editResponse })
      setInteractions((prev) => prev.map((i) => (i.id === id ? { ...i, response: editResponse } : i)))
      setEditingId(null)
      setEditResponse('')
    } catch { /* ignore */ }
  }

  const positiveCount = interactions.filter(i => i.user_feedback === 1).length
  const negativeCount = interactions.filter(i => i.user_feedback === -1).length

  const columns = [
    {
      title: 'Persona',
      dataIndex: 'persona',
      key: 'persona',
      render: (p: string) => <Tag style={{ background: '#27272a', color: '#a1a1aa', border: '1px solid #3f3f46' }}>{p}</Tag>,
      width: 140,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (d: string) => (
        <span style={{ fontSize: 12, color: '#a1a1aa' }}>
          {new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
      width: 160,
    },
    {
      title: 'Prompt',
      dataIndex: 'prompt',
      key: 'prompt',
      ellipsis: true,
      render: (t: string) => (
        <Tooltip title={t}>
          <Text ellipsis style={{ maxWidth: 200, display: 'block', color: '#fafafa' }}>{t}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Response',
      dataIndex: 'response',
      key: 'response',
      ellipsis: true,
      render: (t: string) => (
        <Tooltip title={t}>
          <Text ellipsis style={{ maxWidth: 200, display: 'block', color: '#a1a1aa' }}>{t}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Feedback',
      key: 'feedback',
      width: 100,
      render: (_: any, record: AIInteraction) => (
        <Space size={4}>
          <Button
            size="small"
            type={record.user_feedback === 1 ? 'primary' : 'default'}
            icon={<LikeOutlined />}
            onClick={() => handleFeedback(record.id, record.user_feedback === 1 ? null : 1)}
            style={record.user_feedback === 1 ? { background: '#10b981', border: 'none' } : { background: '#27272a', color: '#a1a1aa', border: '1px solid #3f3f46' }}
          />
          <Button
            size="small"
            type={record.user_feedback === -1 ? 'primary' : 'default'}
            icon={<DislikeOutlined />}
            onClick={() => handleFeedback(record.id, record.user_feedback === -1 ? null : -1)}
            style={record.user_feedback === -1 ? { background: '#ef4444', border: 'none' } : { background: '#27272a', color: '#a1a1aa', border: '1px solid #3f3f46' }}
          />
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 70,
      render: (_: any, record: AIInteraction) => (
        <Button
          size="small"
          icon={<EditOutlined style={{ color: '#a1a1aa' }} />}
          onClick={() => { setEditingId(record.id); setEditResponse(record.response) }}
          style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa' }}
        />
      ),
    },
  ]

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: 24, borderRadius: 16, background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '24px 28px' } }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px', fontWeight: 700, color: '#fafafa' }}>
              Training Data
            </Title>
            <Text style={{ color: '#a1a1aa', fontSize: 14, display: 'block', marginTop: 4 }}>
              Browse AI interactions, provide feedback, and edit responses
            </Text>
          </Col>
          <Col>
            <Space size={24}>
              <Statistic
                title={<Text style={{ color: '#a1a1aa', fontSize: 12 }}>Total</Text>}
                value={interactions.length}
                prefix={<MessageOutlined style={{ color: '#6366f1' }} />}
                valueStyle={{ fontWeight: 700, color: '#fafafa' }}
              />
              <Statistic
                title={<Text style={{ color: '#a1a1aa', fontSize: 12 }}>Positive</Text>}
                value={positiveCount}
                prefix={<LikeOutlined style={{ color: '#10b981' }} />}
                valueStyle={{ fontWeight: 700, color: '#fafafa' }}
              />
              <Statistic
                title={<Text style={{ color: '#a1a1aa', fontSize: 12 }}>Negative</Text>}
                value={negativeCount}
                prefix={<DislikeOutlined style={{ color: '#ef4444' }} />}
                valueStyle={{ fontWeight: 700, color: '#fafafa' }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {error && (
        <Card style={{ marginBottom: 16, borderRadius: 12, background: '#1c1c1f', border: '1px solid #ef4444' }} styles={{ body: { padding: '12px 16px' } }}>
          <Text style={{ color: '#fca5a5' }}>{error}</Text>
        </Card>
      )}

      <Card style={{ borderRadius: 12, background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={interactions}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 15, showSizeChanger: false }}
          locale={{ emptyText: 'No interactions recorded yet.' }}
          size="middle"
        />
      </Card>

      <Modal
        title="Edit Response"
        open={!!editingId}
        onOk={() => editingId && handleEdit(editingId)}
        onCancel={() => { setEditingId(null); setEditResponse('') }}
        okText="Save"
        styles={{ body: { background: '#141416' }, header: { background: '#141416', borderBottom: '1px solid #27272a' } }}
      >
        <TextArea value={editResponse} onChange={(e) => setEditResponse(e.target.value)} rows={6} style={{ background: '#1c1c1f', border: '1px solid #27272a', color: '#fafafa' }} />
      </Modal>
    </div>
  )
}
