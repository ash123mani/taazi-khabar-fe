'use client';

import { useEffect, useState } from 'react';
import { Typography, Table, Tag, Space, Button, message, Card, Input, Select, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { api } from '@/lib/api';
import type { ModelRegistry } from '@/lib/types';

const { Title } = Typography;
const { Search } = Input;

export default function ModelsPage() {
  const [models, setModels] = useState<ModelRegistry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const fetchModels = async () => {
    setLoading(true);
    try {
      const data = await api.getModels();
      const flat: ModelRegistry[] = [];
      if (Array.isArray(data)) {
        flat.push(...data);
      } else if (data && typeof data === 'object') {
        for (const [persona, models] of Object.entries(data)) {
          for (const m of models as any[]) {
            flat.push({
              id: m.id,
              name: m.name,
              provider: m.provider,
              status: (m.active ?? m.is_active) ? 'active' : 'inactive',
              model_type: persona,
              created_at: m.created_at || '',
            });
          }
        }
      }
      setModels(flat);
    } catch (err: any) {
      message.error(err.message || 'Failed to load models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteModel(id);
      message.success('Model deleted successfully');
      fetchModels();
    } catch (err: any) {
      message.error(err.message || 'Failed to delete model');
    }
  };

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      !search ||
      model.name?.toLowerCase().includes(search.toLowerCase()) ||
      model.provider?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || model.status === statusFilter;
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
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
      render: (text: string) => <span style={{ color: 'var(--color-text-secondary)' }}>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'active' ? '#22c55e' : status === 'inactive' ? '#ef4444' : '#eab308';
        return (
          <Tag color={color} style={{ borderRadius: 6, fontWeight: 600, fontSize: 12 }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'model_type',
      key: 'model_type',
      render: (type: string) => <span style={{ color: 'var(--color-text-tertiary)' }}>{type || 'N/A'}</span>,
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
      render: (_: any, record: ModelRegistry) => (
        <Space>
          <Button size="small" type="default" style={{ fontWeight: 600, borderRadius: 6 }}>
            Edit
          </Button>
          <Popconfirm
            title="Delete model"
            description="Are you sure you want to delete this model?"
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
        Model Registry
      </Title>
      <Card
        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }}
        styles={{ body: { padding: 18 } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <Space>
            <Search
              placeholder="Search models..."
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
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'pending', label: 'Pending' },
              ]}
            />
          </Space>
          <Button onClick={fetchModels} type="default" style={{ fontWeight: 600, borderRadius: 8 }}>
            Refresh
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredModels}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => <span style={{ color: 'var(--color-text-tertiary)' }}>Total {total} models</span>,
          }}
          onChange={(p) => setPagination({ current: p.current || 1, pageSize: p.pageSize || 10 })}
        />
      </Card>
    </div>
  );
}
