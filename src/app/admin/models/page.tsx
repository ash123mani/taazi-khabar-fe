'use client'

import { useEffect, useState } from 'react'
import { Typography, Tag, Button, Spin, Select, message } from 'antd'
import { CheckOutlined, SwapOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'

const { Title, Text } = Typography

export default function ModelsPage() {
  const [grouped, setGrouped] = useState<Record<string, { name: string; provider: string; active: boolean }[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [swapping, setSwapping] = useState<string | null>(null)

  const fetchModels = async () => {
    try {
      const data = await api.getModels()
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setGrouped(data)
      } else {
        setGrouped({})
      }
    } catch {
      setError('Failed to load models')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchModels() }, [])

  const handleSwap = async (persona: string, modelName: string) => {
    const key = `${persona}::${modelName}`
    setSwapping(key)
    try {
      await api.updateModels({ persona, model_name: modelName })
      message.success(`Switched ${persona} to ${modelName}`)
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

  const personas = Object.keys(grouped)

  return (
    <div>
      <Title level={4} style={{
        marginBottom: 4,
        letterSpacing: '-0.5px',
        color: '#1a1a1a',
      }}>
        Model Registry
      </Title>
      <Text style={{ display: 'block', marginBottom: 24, color: '#9e9e9e' }}>
        Manage active models per persona.
      </Text>

      {error && <div style={{ padding: '8px 12px', border: '1px solid #c62828', borderRadius: 4, background: '#ffebee', color: '#c62828', marginBottom: 16 }}>{error}</div>}

      {personas.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          No models registered.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {personas.map((persona) => {
            const models = grouped[persona]
            const active = models.find((m) => m.active)
            return (
              <div key={persona} className="article-card" style={{ padding: 20 }}>
                <div style={{ marginBottom: 12 }}>
                  <Title level={5} style={{ margin: 0, textTransform: 'capitalize' }}>
                    {persona.replace(/_/g, ' ')}
                  </Title>
                  {active && (
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Active: <Text code>{active.name}</Text>
                    </Text>
                  )}
                </div>
                {models.map((model) => (
                  <div
                    key={model.name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      marginBottom: 4,
                    }}
                  >
                    <div>
                      <Text strong={model.active}>{model.name}</Text>
                      <Tag style={{ marginLeft: 8 }}>{model.provider}</Tag>
                      {model.active && (
                        <Tag icon={<CheckOutlined />}>
                          Active
                        </Tag>
                      )}
                    </div>
                    {!model.active && (
                      <Button
                        size="small"
                        icon={<SwapOutlined />}
                        loading={swapping === `${persona}::${model.name}`}
                        onClick={() => handleSwap(persona, model.name)}
                        style={{}}
                      >
                        Make Active
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
