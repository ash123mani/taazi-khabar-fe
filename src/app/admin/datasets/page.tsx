'use client'

import { useEffect, useState } from 'react'
import { Typography, Table, Tag, Button, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
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
      render: (n: string) => <Text strong>{n}</Text>,
    },
    {
      title: 'Persona',
      dataIndex: 'persona',
      key: 'persona',
      render: (p: string) => (
        <Tag style={{ fontWeight: 600 }}>{p.replace(/_/g, ' ')}</Tag>
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
        <Tag style={{ fontWeight: 600 }}>
          {s}
        </Tag>
      ),
    },
    {
      title: 'LoRA Adapter',
      dataIndex: 'lora_adapter_path',
      key: 'lora_adapter_path',
      render: (p: string | null) => p
        ? <Tag style={{ fontWeight: 600 }}>{p}</Tag>
        : '-',
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (d: string) => (
        <span style={{ fontSize: 13 }}>
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
          icon={<DownloadOutlined />}
          loading={downloading === record.id}
          onClick={() => handleDownload(record.id)}
        />
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={4} style={{
            margin: 0,
            letterSpacing: '-0.5px',
            color: '#1a1a1a',
          }}>
            Datasets
          </Title>
          <Text style={{ color: '#9e9e9e' }}>Manage training datasets for fine-tuning</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowForm(true)}
          style={{ fontWeight: 600 }}
        >
          Build Dataset
        </Button>
      </div>

      {error && <div style={{ padding: '8px 12px', border: '1px solid #c62828', borderRadius: 4, background: '#ffebee', color: '#c62828', marginBottom: 16 }}>{error}</div>}

      <Table
        dataSource={datasets}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{ emptyText: 'No datasets created yet.' }}
        size="small"
      />

      <Modal
        title="Build Dataset"
        open={showForm}
        onCancel={() => { setShowForm(false); form.resetFields() }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleBuild}>
          <Form.Item name="name" label="Dataset Name" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g., polity-articles-v1" />
          </Form.Item>
          <Form.Item name="persona" label="Persona" initialValue={PERSONAS[0]}>
            <Select>
              {PERSONAS.map((p) => (
                <Select.Option key={p} value={p}>{p.replace(/_/g, ' ')}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={building}
            style={{ fontWeight: 600 }}
          >
            {building ? 'Building...' : 'Build Dataset'}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
