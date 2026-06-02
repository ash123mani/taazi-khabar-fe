'use client'

import { useEffect, useState } from 'react'
import { Typography, Table, Tag, Button, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
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
  const [form] = Form.useForm()

  const fetchDatasets = async () => {
    try {
      const data = await api.getInteractions({ type: 'datasets' })
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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (n: string) => <Text strong>{n}</Text>,
    },
    {
      title: 'Persona',
      dataIndex: 'persona',
      key: 'persona',
      render: (p: string) => (
        <Tag style={{ border: '1px solid #000', fontWeight: 600 }}>{p.replace(/_/g, ' ')}</Tag>
      ),
    },
    {
      title: 'Examples',
      dataIndex: 'num_examples',
      key: 'num_examples',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag style={{
          border: '1px solid #000',
          fontWeight: 600,
          background: s === 'ready' ? '#e8e8e8' : s === 'building' ? '#f5f5f5' : '#fff',
        }}>
          {s}
        </Tag>
      ),
    },
    {
      title: 'LoRA Adapter',
      dataIndex: 'lora_adapter_path',
      key: 'lora_adapter_path',
      render: (p: string | null) => p
        ? <Tag style={{ border: '1px solid #000', fontWeight: 600 }}>{p}</Tag>
        : '-',
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (d: string) => (
        <span style={{ color: '#666', fontSize: 13 }}>
          {new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={4} style={{ margin: 0, letterSpacing: '-0.5px' }}>Datasets</Title>
          <Text style={{ color: '#666' }}>Manage training datasets for fine-tuning</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowForm(true)}
          style={{ borderRadius: 0, border: '2px solid #000', fontWeight: 600 }}
        >
          Build Dataset
        </Button>
      </div>

      {error && <div style={{ padding: 12, border: '2px solid #000', background: '#f5f5f5', marginBottom: 16 }}>{error}</div>}

      <Table
        dataSource={datasets}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{ emptyText: 'No datasets created yet.' }}
        size="small"
        style={{ border: '2px solid #000' }}
      />

      <Modal
        title="Build Dataset"
        open={showForm}
        onCancel={() => { setShowForm(false); form.resetFields() }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleBuild}>
          <Form.Item name="name" label="Dataset Name" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g., polity-articles-v1" style={{ border: '2px solid #000', borderRadius: 0 }} />
          </Form.Item>
          <Form.Item name="persona" label="Persona" initialValue={PERSONAS[0]}>
            <Select style={{ border: '2px solid #000', borderRadius: 0 }}>
              {PERSONAS.map((p) => (
                <Select.Option key={p} value={p}>{p.replace(/_/g, ' ')}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={building}
            style={{ borderRadius: 0, border: '2px solid #000', fontWeight: 600 }}
          >
            {building ? 'Building...' : 'Build Dataset'}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
