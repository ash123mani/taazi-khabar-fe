'use client'

import { useEffect, useState } from 'react'
import { Typography, Table, Tag, Spin, Button, Modal, Input, Tooltip } from 'antd'
import { EditOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
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

  const columns = [
    {
      title: 'Persona',
      dataIndex: 'persona',
      key: 'persona',
      render: (p: string) => <Tag style={{ fontWeight: 600 }}>{p}</Tag>,
      width: 120,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (d: string) => (
        <span style={{ fontSize: 13 }}>
          {new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
      width: 150,
    },
    {
      title: 'Prompt',
      dataIndex: 'prompt',
      key: 'prompt',
      ellipsis: true,
      render: (t: string) => (
        <Tooltip title={t}>
          <Text ellipsis style={{ maxWidth: 200, display: 'block' }}>{t}</Text>
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
          <Text ellipsis style={{ maxWidth: 200, display: 'block' }}>{t}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Feedback',
      key: 'feedback',
      width: 100,
      render: (_: any, record: AIInteraction) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <Button
            size="small"
            type={record.user_feedback === 1 ? 'primary' : 'default'}
            icon={<LikeOutlined />}
            onClick={() => handleFeedback(record.id, record.user_feedback === 1 ? null : 1)}
            style={{}}
          />
          <Button
            size="small"
            type={record.user_feedback === -1 ? 'primary' : 'default'}
            icon={<DislikeOutlined />}
            onClick={() => handleFeedback(record.id, record.user_feedback === -1 ? null : -1)}
            style={{}}
          />
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 70,
      render: (_: any, record: AIInteraction) => (
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => { setEditingId(record.id); setEditResponse(record.response) }}
          style={{}}
        />
      ),
    },
  ]

  return (
    <div>
      <Title level={4} style={{
        marginBottom: 4,
        letterSpacing: '-0.5px',
        background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Training Data
      </Title>
      <Text style={{ display: 'block', marginBottom: 16, opacity: 0.5 }}>
        Browse AI interactions, provide feedback, and edit responses.
      </Text>

      {error && <div style={{ padding: 12, border: '1px solid var(--ant-color-error)', marginBottom: 16 }}>{error}</div>}

      <Table
        dataSource={interactions}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 15, showSizeChanger: false }}
        locale={{ emptyText: 'No interactions recorded yet.' }}
        size="small"
      />

      <Modal
        title="Edit Response"
        open={!!editingId}
        onOk={() => editingId && handleEdit(editingId)}
        onCancel={() => { setEditingId(null); setEditResponse('') }}
        okText="Save"
        okButtonProps={{ style: { fontWeight: 600 } }}
        cancelButtonProps={{}}
      >
        <TextArea value={editResponse} onChange={(e) => setEditResponse(e.target.value)} rows={6} />
      </Modal>
    </div>
  )
}
