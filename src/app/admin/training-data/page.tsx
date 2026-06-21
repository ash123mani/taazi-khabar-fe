'use client';

import { useEffect, useState } from 'react';
import { Typography, Table, Tag, Space, Button, message, Card, Input, Select, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { api } from '@/lib/api';
import type { TrainingDataset } from '@/lib/types';

const { Title } = Typography;
const { Search } = Input;

export default function TrainingDataPage() {
  const [datasets, setDatasets] = useState<TrainingDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const fetchDatasets = async () => {
    setLoading(true);
    try {
      const data = await api.getTrainingDatasets();
      setDatasets(data?.datasets || data || []);
    } catch (err: any) {
      message.error(err.message || 'Failed to load training data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTrainingDataset(id);
      message.success('Training data deleted successfully');
      fetchDatasets();
    } catch (err: any) {
      message.error(err.message || 'Failed to delete training data');
    }
  };

  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch =
      !search ||
      dataset.name?.toLowerCase().includes(search.toLowerCase()) ||
      dataset.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || dataset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'ready' ? '#22c55e' : status === 'processing' ? '#eab308' : '#ef4444';
        return (
          <Tag color={color} style={{ borderRadius: 6, fontWeight: 600, fontSize: 12 }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Records',
      dataIndex: 'record_count',
      key: 'record_count',
      render: (count: number) => (
        <span style={{ color: 'var(--color-text-secondary)' }}>{count?.toLocaleString() || 0}</span>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => (
        <span style={{ color: 'var(--color-text-tertiary)' }}>{dayjs(date).format('DD-MM-YYYY')}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: TrainingDataset) => (
        <Space>
          <Button size="small" type="default" style={{ fontWeight: 600, borderRadius: 6 }}>
            View
          </Button>
          <Popconfirm
            title="Delete training data"
            description="Are you sure you want to delete this training data?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" style={{ borderRadius: 6 }}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16, color: 'var(--color-text)' }}>
        Training Data
      </Title>
      <Card
        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }}
        styles={{ body: { padding: 18 } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <Space>
            <Search
              placeholder="Search training data..."
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
            <Select
              placeholder="Filter by status"
              onChange={(value) => setStatusFilter(value)}
              style={{ width: 150 }}
              allowClear
              options={[
                { value: 'ready', label: 'Ready' },
                { value: 'processing', label: 'Processing' },
                { value: 'error', label: 'Error' },
              ]}
            />
          </Space>
          <Button onClick={fetchDatasets} type="default" style={{ fontWeight: 600, borderRadius: 8 }}>
            Refresh
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredDatasets}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => <span style={{ color: 'var(--color-text-tertiary)' }}>Total {total} records</span>,
          }}
          onChange={(p) => setPagination({ current: p.current || 1, pageSize: p.pageSize || 10 })}
        />
      </Card>
    </div>
  );
}
