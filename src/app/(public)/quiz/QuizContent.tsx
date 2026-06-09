'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Typography, Button, Spin, DatePicker, Tag, Card, Empty, Row, Col, Tooltip } from 'antd'
import { CalendarOutlined, ThunderboltOutlined, DeleteOutlined, CheckCircleFilled } from '@ant-design/icons'
import dayjs from 'dayjs'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import type { Article } from '@/lib/types'

const { Text, Title } = Typography

export default function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselected = searchParams.get('selected')?.split(',').filter(Boolean) || []
  const token = useAuthStore((s) => s.accessToken)

  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState<string>(today)
  const [articles, setArticles] = useState<Article[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set(preselected))
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const fetchArticles = useCallback(async (d: string) => {
    setLoading(true)
    setError('')
    try {
      const data = await api.getArticles({ date: d })
      setArticles(Array.isArray(data) ? data : data.articles || [])
    } catch {
      setError('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles(date)
  }, [date, fetchArticles])

  const handleDragStart = (e: React.DragEvent, articleId: string) => {
    e.dataTransfer.setData('text/plain', articleId)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const id = e.dataTransfer.getData('text/plain')
    if (id && !selected.has(id)) {
      setSelected(new Set([...Array.from(selected), id]))
    }
  }

  const removeSelected = (id: string) => {
    const next = new Set(selected)
    next.delete(id)
    setSelected(next)
  }

  const handleGenerate = async () => {
    if (selected.size === 0) return
    if (!token) {
      setError('Please login first to generate a quiz')
      return
    }
    setGenerating(true)
    setError('')
    try {
      const data = await api.generateQuiz(Array.from(selected), 10)
      router.push(`/quiz/${data.quiz_id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz')
      setGenerating(false)
    }
  }

  const handleLoginRedirect = () => {
    router.push('/login?callbackUrl=/quiz')
  }

  const availableArticles = articles.filter((a) => !selected.has(a.id))
  const selectedArticles = articles.filter((a) => selected.has(a.id))

  return (
    <div>
      <Card style={{ marginBottom: 28, borderRadius: 16, background: '#0a0a0a', border: '1px solid #1f1f1f' }} styles={{ body: { padding: '24px 28px' } }}>
        <Row justify="space-between" align="middle">
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ThunderboltOutlined style={{ fontSize: 20, color: '#ffffff' }} />
              </div>
              <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px', fontWeight: 700, color: '#ffffff' }}>
                Generate Quiz
              </Title>
            </div>
            <Text style={{ color: '#6b6b6b', fontSize: 14, display: 'block', marginTop: 4, marginLeft: 52 }}>
              Drag articles to the right panel to select them for quiz generation
            </Text>
          </Col>
          <Col>
            <DatePicker
              value={dayjs(date)}
              onChange={(d) => { if (d) { setDate(d.format('YYYY-MM-DD')); setSelected(new Set()) } }}
              allowClear={false}
              suffixIcon={<CalendarOutlined />}
              style={{ width: 160 }}
              size="large"
            />
          </Col>
        </Row>
      </Card>

      {error && (
        <Card style={{ marginBottom: 20, borderRadius: 12, background: '#141414', border: '1px solid #ef4444' }} styles={{ body: { padding: '14px 20px' } }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Text style={{ color: '#fca5a5' }}>{error}</Text>
            </Col>
            {error.includes('login') && (
              <Col>
                <Button type="primary" size="small" onClick={handleLoginRedirect}>Login</Button>
              </Col>
            )}
          </Row>
        </Card>
      )}

      {loading ? (
        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: '#0a0a0a', border: '1px solid #1f1f1f' }} styles={{ body: { padding: '80px 24px' } }}>
          <Spin size="large" />
        </Card>
      ) : (
        <Row gutter={20} style={{ minHeight: 500 }}>
          <Col xs={24} lg={12}>
            <Card
              style={{ borderRadius: 16, height: '100%', background: '#0a0a0a', border: '1px solid #1f1f1f' }}
              styles={{ body: { padding: '20px' } }}
              title={
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong style={{ fontSize: 14, color: '#ffffff' }}>
                      Available Articles
                    </Text>
                    <Tag style={{ marginLeft: 8, borderRadius: 6, background: '#141414', color: '#a1a1a1', border: '1px solid #1f1f1f' }}>{availableArticles.length}</Tag>
                  </Col>
                </Row>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 500, overflowY: 'auto' }}>
                {availableArticles.map((article) => (
                  <Tooltip title="Click or drag to select" key={article.id}>
                    <Card
                      size="small"
                      hoverable
                      draggable
                      onDragStart={(e) => handleDragStart(e, article.id)}
                      onClick={() => setSelected(new Set([...Array.from(selected), article.id]))}
                      style={{ borderRadius: 10, cursor: 'grab', border: '1px solid #1f1f1f', background: '#141414', transition: 'all 0.2s' }}
                      styles={{ body: { padding: '10px 12px' } }}
                    >
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        {article.image_url && (
                          <div style={{ flexShrink: 0, width: 64, height: 48, borderRadius: 6, overflow: 'hidden', background: '#0f0f0f' }}>
                            <img
                              src={article.image_url}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                            <Text style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, flex: 1, color: '#ffffff', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {article.headline}
                            </Text>
                            {article.has_quiz && (
                              <Tag icon={<CheckCircleFilled />} color="success" style={{ fontSize: 10, margin: 0, whiteSpace: 'nowrap', borderRadius: 4, flexShrink: 0, lineHeight: '18px', padding: '0 6px' }}>
                                Quizzed
                              </Tag>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                            {article.syllabus_tag && (
                              <Tag style={{ fontSize: 10, borderRadius: 4, margin: 0, background: '#0f0f0f', color: '#a1a1a1', border: '1px solid #2a2a2a', padding: '0 6px', lineHeight: '18px', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {article.syllabus_tag}
                              </Tag>
                            )}
                            <Text style={{ color: '#6b6b6b', fontSize: 10, whiteSpace: 'nowrap' }}>
                              {article.source === 'thehindu' ? 'The Hindu' : 'Indian Express'}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Tooltip>
                ))}
                {availableArticles.length === 0 && (
                  <Empty description="No articles available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              style={{
                borderRadius: 16,
                height: '100%',
                border: dragOver ? '2px dashed #6366f1' : selectedArticles.length > 0 ? '2px dashed #22c55e' : '2px dashed #2a2a2a',
                background: dragOver ? '#141414' : selectedArticles.length > 0 ? '#141414' : '#0a0a0a',
                transition: 'all 0.3s',
              }}
              styles={{ body: { padding: '20px' } }}
              title={
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong style={{ fontSize: 14, color: '#ffffff' }}>
                      Selected for Quiz
                    </Text>
                    <Tag color={selectedArticles.length > 0 ? 'success' : 'default'} style={{ marginLeft: 8, borderRadius: 6, background: selectedArticles.length > 0 ? '#22c55e' : '#141414', color: selectedArticles.length > 0 ? '#000000' : '#a1a1a1', border: '1px solid #1f1f1f' }}>
                      {selectedArticles.length}
                    </Tag>
                  </Col>
                </Row>
              }
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 380, overflowY: 'auto', marginBottom: 16 }}>
                {selectedArticles.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 64, height: 64, borderRadius: 16, background: '#141414', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                        <ThunderboltOutlined style={{ fontSize: 28, color: '#4a4a4a' }} />
                      </div>
                      <Text style={{ color: '#6b6b6b', fontSize: 14, display: 'block', marginBottom: 4 }}>Drag articles here</Text>
                      <Text style={{ color: '#4a4a4a', fontSize: 12 }}>or click on articles to select</Text>
                    </div>
                  </div>
                ) : (
                  selectedArticles.map((article) => (
                    <Card
                      key={article.id}
                      size="small"
                      style={{ borderRadius: 10, background: '#141414', border: '1px solid #22c55e' }}
                      styles={{ body: { padding: '10px 12px' } }}
                    >
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        {article.image_url && (
                          <div style={{ flexShrink: 0, width: 56, height: 42, borderRadius: 6, overflow: 'hidden', background: '#0f0f0f' }}>
                            <img
                              src={article.image_url}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                            <Text style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, flex: 1, color: '#ffffff' }}>
                              {article.headline}
                            </Text>
                            <Tooltip title="Remove">
                              <Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined style={{ color: '#6b6b6b', fontSize: 12 }} />}
                                onClick={() => removeSelected(article.id)}
                                style={{ padding: 0, height: 'auto', marginTop: -2, flexShrink: 0 }}
                              />
                            </Tooltip>
                          </div>
                          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                            {article.syllabus_tag && (
                              <Tag style={{ fontSize: 10, borderRadius: 4, margin: 0, background: '#0f0f0f', color: '#a1a1a1', border: '1px solid #2a2a2a', padding: '0 6px', lineHeight: '18px', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {article.syllabus_tag}
                              </Tag>
                            )}
                            <Text style={{ color: '#6b6b6b', fontSize: 10, whiteSpace: 'nowrap' }}>
                              {article.source === 'thehindu' ? 'The Hindu' : 'Indian Express'}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {selectedArticles.length > 0 && (
                <Button
                  type="primary"
                  size="large"
                  icon={<ThunderboltOutlined />}
                  loading={generating}
                  onClick={handleGenerate}
                  block
                  style={{ height: 48, fontWeight: 700, fontSize: 15, borderRadius: 12 }}
                >
                  Generate Quiz ({selectedArticles.length} article{selectedArticles.length !== 1 ? 's' : ''})
                </Button>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  )
}
