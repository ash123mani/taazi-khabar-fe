'use client'

import { useEffect, useState } from 'react'
import { Typography, Tag, Button, Spin } from 'antd'
import { SwapOutlined, CheckOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'

const { Title, Text } = Typography

interface Model {
  id: string
  name: string
  version: string
  status: string
  active: boolean
  accuracy: number | null
  created_at: string
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [swapping, setSwapping] = useState<string | null>(null)

  const fetchModels = async () => {
    try {
      const data = await api.getModels()
      setModels(Array.isArray(data) ? data : data.models || [])
    } catch {
      setError('Failed to load models')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchModels() }, [])

  const handleSwap = async (modelId: string) => {
    setSwapping(modelId)
    try {
      await api.updateModels({ active_model_id: modelId })
      fetchModels()
    } catch (err: any) {
      setError(err.message || 'Failed to swap model')
    } finally {
      setSwapping(null)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 4, letterSpacing: '-0.5px' }}>Model Registry</Title>
      <Text style={{ color: '#666', display: 'block', marginBottom: 24 }}>
        Manage active model, swap versions, rollback if needed.
      </Text>

      {error && <div style={{ padding: 12, border: '2px solid #000', background: '#f5f5f5', marginBottom: 16 }}>{error}</div>}

      {models.length === 0 ? (
        <div style={{ padding: 60, border: '2px solid #000', textAlign: 'center', background: '#fff', color: '#666' }}>
          No models registered.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {models.map((model) => (
            <div
              key={model.id}
              style={{
                border: `2px solid ${model.active ? '#000' : '#000'}`,
                padding: 20,
                background: model.active ? '#f5f5f5' : '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Text strong style={{ fontSize: 15 }}>{model.name}</Text>
                    {model.active && (
                      <Tag icon={<CheckOutlined />} style={{ border: '1px solid #000', fontWeight: 600, background: '#e8e8e8' }}>
                        Active
                      </Tag>
                    )}
                  </div>
                  <Text style={{ color: '#666', fontSize: 13 }}>v{model.version}</Text>
                </div>
                {!model.active && (
                  <Button
                    icon={<SwapOutlined />}
                    loading={swapping === model.id}
                    onClick={() => handleSwap(model.id)}
                    style={{ borderRadius: 0, border: '2px solid #000' }}
                  >
                    Make Active
                  </Button>
                )}
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 13, color: '#666' }}>
                <Tag style={{ border: '1px solid #000', fontWeight: 600, background: model.status === 'ready' ? '#e8e8e8' : '#f5f5f5' }}>
                  {model.status}
                </Tag>
                {model.accuracy !== null && <span>Accuracy: {(model.accuracy * 100).toFixed(1)}%</span>}
                <span>
                  Added: {new Date(model.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
