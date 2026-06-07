 'use client'

import { useEffect, useState } from 'react'
import { Typography, Tag, Button, Spin, Select, message, Card, Row, Col, Statistic, Space } from 'antd'
import { CheckOutlined, SwapOutlined, RobotOutlined, ThunderboltOutlined } from '@ant-design/icons'
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
    return (
      <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '80px 24px' } }}>
        <Spin size="large" />
      </Card>
    )
  }

  const personas = Object.keys(grouped)
  const totalModels = Object.values(grouped).reduce((sum, models) => sum + models.length, 0)
  const activeModels = Object.values(grouped).reduce((sum, models) => sum + models.filter(m => m.active).length, 0)

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: 24, borderRadius: 16, background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '24px 28px' } }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px', fontWeight: 700, color: '#fafafa' }}>
              Model Registry
            </Title>
            <Text style={{ color: '#a1a1aa', fontSize: 14, display: 'block', marginTop: 4 }}>
              Manage active models per persona
            </Text>
          </Col>
          <Col>
            <Space size={24}>
              <Statistic
                title={<Text style={{ color: '#a1a1aa', fontSize: 12 }}>Total Models</Text>}
                value={totalModels}
                prefix={<RobotOutlined style={{ color: '#6366f1' }} />}
                valueStyle={{ fontWeight: 700, color: '#fafafa' }}
              />
              <Statistic
                title={<Text style={{ color: '#a1a1aa', fontSize: 12 }}>Active</Text>}
                value={activeModels}
                prefix={<ThunderboltOutlined style={{ color: '#10b981' }} />}
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

      {personas.length === 0 ? (
        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '80px 24px' } }}>
          <RobotOutlined style={{ fontSize: 48, color: '#71717a', display: 'block', marginBottom: 16 }} />
          <Title level={4} style={{ color: '#d4d4d8', marginBottom: 8 }}>No models registered</Title>
          <Text style={{ color: '#a1a1aa' }}>Add models to the registry to get started</Text>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {personas.map((persona) => {
            const models = grouped[persona]
            const active = models.find((m) => m.active)
            return (
              <Card key={persona} style={{ borderRadius: 14, background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '20px 24px' } }}>
                <div style={{ marginBottom: 16 }}>
                  <Title level={5} style={{ margin: 0, textTransform: 'capitalize', color: '#fafafa' }}>
                    {persona.replace(/_/g, ' ')}
                  </Title>
                  {active && (
                    <Text style={{ fontSize: 13, color: '#a1a1aa' }}>
                      Active: <Text code style={{ background: '#27272a', color: '#818cf8', padding: '2px 6px', borderRadius: 4, border: '1px solid #3f3f46' }}>{active.name}</Text>
                    </Text>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {models.map((model) => (
                    <div
                      key={model.name}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: '#1c1c1f',
                        borderRadius: 10,
                        border: '1px solid #27272a',
                      }}
                    >
                      <div>
                        <Text strong style={{ color: model.active ? '#fafafa' : '#a1a1aa' }}>{model.name}</Text>
                        <Tag style={{ marginLeft: 8, background: '#27272a', color: '#a1a1aa', border: '1px solid #3f3f46' }}>{model.provider}</Tag>
                        {model.active && (
                          <Tag icon={<CheckOutlined />} style={{ background: '#10b981', color: '#fff', border: 'none' }}>
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
                          style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6 }}
                        >
                          Make Active
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
