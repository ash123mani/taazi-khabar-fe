'use client'

import { useEffect, useState } from 'react'
import { Typography, Table, Tag, Button, Modal, Form, Input, Select, Card, Row, Col, Statistic, Space } from 'antd'
import { PlusOutlined, DownloadOutlined, DatabaseOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'
import type { TrainingDataset } from '@/lib/types'

const { Title, Text } = Typography
const PERSONAS = ['article_summarizer', 'quiz_generator', 'gk_analyst', 'general']

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<TrainingDataset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [building, setBuilding] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [form] = Form.useForm()

  const fetchDatasets = async () => {
    try {
      const data = await api.getDatasets()
      setDatasets(Array.isArray(data) ? data : data.datasets || [])
    } catch {
      setError('Failed to load datasets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDatasets() }, [])

  const handleBuild = async (values: { name: string; persona: string }) => {
    setBuilding(true)
    try {
      await api.buildDataset(values)
      setShowForm(false)
      form.resetFields()
      fetchDatasets()
    } catch (err: any) {
      setError(err.message || 'Failed to build dataset')
    } finally {
      setBuilding(false)
    }
  }

  const handleDownload = async (id: string) => {
    setDownloading(id)
    try {
      await api.downloadDataset(id)
    } catch (err: any) {
      setError(err.message || 'Download failed')
    } finally {
      setDownloading(null)
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (n: string) => <Text strong style={{ color: '#fafafa' }}>{n}</Text>,
    },
    {
      title: 'Persona',
      dataIndex: 'persona',
      key: 'persona',
      render: (p: string) => (
        <Tag style={{ background: '#27272a', color: '#a1a1aa', border: '1px solid #3f3f46' }}>{p.replace(/_/g, ' ')}</Tag>
      ),
    },
    {
      title: 'Examples',
      dataIndex: 'num_examples',
      key: 'num_examples',
      render: (n: number) => <Text style={{ color: '#a1a1aa' }}>{n}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag color={s === 'ready' ? 'success' : s === 'building' ? 'processing' : 'default'} style={{ background: s === 'ready' ? '#10b981' : s === 'building' ? '#6366f1' : '#27272a', color: '#fff', border: 'none' }}>
          {s}
        </Tag>
      ),
    },
    {
      title: 'LoRA Adapter',
      dataIndex: 'lora_adapter_path',
      key: 'lora_adapter_path',
      render: (p: string | null) => p
        ? <Tag style={{ background: '#27272a', color: '#a1a1aa', border: '1px solid #3f3f46' }}>{p}</Tag>
        : <Text style={{ color: '#71717a' }}>-</Text>,
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (d: string) => (
        <span style={{ fontSize: 12, color: '#a1a1aa' }}>
          {new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, record: TrainingDataset) => (
        <Button
          type="text"
          icon={<DownloadOutlined style={{ color: '#a1a1aa' }} />}
          loading={downloading === record.id}
          onClick={() => handleDownload(record.id)}
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
              Datasets
            </Title>
            <Text style={{ color: '#a1a1aa', fontSize: 14, display: 'block', marginTop: 4 }}>
              Manage training datasets for fine-tuning
            </Text>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowForm(true)} size="middle">
              Build Dataset
            </Button>
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
          dataSource={datasets}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{ emptyText: 'No datasets created yet.' }}
          size="middle"
        />
      </Card>

      <Modal
        title="Build Dataset"
        open={showForm}
        onCancel={() => { setShowForm(false); form.resetFields() }}
        footer={null}
        styles={{ body: { background: '#141416' }, header: { background: '#141416', borderBottom: '1px solid #27272a' } }}
      >
        <Form form={form} layout="vertical" onFinish={handleBuild}>
          <Form.Item name="name" label={<Text style={{ color: '#a1a1aa' }}>Dataset Name</Text>} rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g., polity-articles-v1" />
          </Form.Item>
          <Form.Item name="persona" label={<Text style={{ color: '#a1a1aa' }}>Persona</Text>} initialValue={PERSONAS[0]}>
            <Select>
              {PERSONAS.map((p) => (
                <Select.Option key={p} value={p}>{p.replace(/_/g, ' ')}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={building} block style={{ borderRadius: 8, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none' }}>
            {building ? 'Building...' : 'Build Dataset'}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
