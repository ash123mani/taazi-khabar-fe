'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Typography, Button, Spin, DatePicker, Tag, Card, Empty } from 'antd'
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
      setSelected(new Set([...selected, id]))
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ marginBottom: 4, letterSpacing: '-0.5px' }}>Generate Quiz</Title>
          <Text type="secondary">
            Drag articles to the right panel to select them for quiz generation
          </Text>
        </div>
        <DatePicker
          value={dayjs(date)}
          onChange={(d) => { if (d) { setDate(d.format('YYYY-MM-DD')); setSelected(new Set()) } }}
          allowClear={false}
          suffixIcon={<CalendarOutlined />}
          style={{ width: 160 }}
        />
      </div>

      {error && (
        <div style={{ padding: '10px 14px', border: '1px solid #c62828', borderRadius: 4, background: '#ffebee', color: '#c62828', marginBottom: 16, fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          {error.includes('login') && (
            <Button type="primary" size="small" onClick={handleLoginRedirect} style={{ fontWeight: 600 }}>
              Login
            </Button>
          )}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 16, minHeight: 400 }}>
          {/* Available Articles */}
          <div style={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 4, background: '#fafafa', padding: 12 }}>
            <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 12, color: '#555' }}>
              Available Articles ({availableArticles.length})
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {availableArticles.map((article) => (
                <div
                  key={article.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, article.id)}
                  onClick={() => setSelected(new Set([...selected, article.id]))}
                  style={{ cursor: 'pointer' }}
                >
                  <Card
                    size="small"
                    hoverable
                    style={{ borderRadius: 4, background: '#fff', border: '1px solid #e0e0e0' }}
                    styles={{ body: { padding: '10px 12px' } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <Text style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, flex: 1, color: '#1a1a1a' }}>
                        {article.headline}
                      </Text>
                      {article.has_quiz && (
                        <Tag icon={<CheckCircleFilled />} color="green" style={{ fontSize: 10, margin: 0, whiteSpace: 'nowrap' }}>
                          Quizzed
                        </Tag>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                      {article.syllabus_tag && (
                        <Tag style={{ fontSize: 9, borderRadius: 2, margin: 0, background: '#f5f5f5', color: '#555', borderColor: '#e0e0e0', padding: '0 4px', lineHeight: '18px' }}>
                          {article.syllabus_tag}
                        </Tag>
                      )}
                      <Text style={{ color: '#bbb', fontSize: 9 }}>
                        {article.source === 'thehindu' ? 'The Hindu' : 'Indian Express'}
                      </Text>
                    </div>
                  </Card>
                </div>
              ))}
              {availableArticles.length === 0 && (
                <Empty description="No articles available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              flex: 1,
              border: `2px dashed ${dragOver ? '#1a73e8' : selectedArticles.length > 0 ? '#2e7d32' : '#d0d0d0'}`,
              borderRadius: 4,
              background: dragOver ? '#e8f0fe' : selectedArticles.length > 0 ? '#f1f8e9' : '#fafafa',
              padding: 12,
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 12, color: '#555' }}>
              Selected for Quiz ({selectedArticles.length})
            </Text>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedArticles.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#bbb', fontSize: 13 }}>
                    Drag articles here
                  </Text>
                </div>
              ) : (
                selectedArticles.map((article) => (
                  <div key={article.id}>
                    <Card
                      size="small"
                      style={{ borderRadius: 4, background: '#fff', border: '1px solid #c8e6c9' }}
                      styles={{ body: { padding: '10px 12px' } }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <Text style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, flex: 1, color: '#1a1a1a' }}>
                          {article.headline}
                        </Text>
                        <Button
                          type="text"
                          size="small"
                          icon={<DeleteOutlined style={{ color: '#999', fontSize: 12 }} />}
                          onClick={() => removeSelected(article.id)}
                          style={{ padding: 0, height: 'auto', marginTop: -2 }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                        <Text style={{ color: '#999', fontSize: 9 }}>
                          {article.source === 'thehindu' ? 'The Hindu' : 'Indian Express'}
                        </Text>
                      </div>
                    </Card>
                  </div>
                ))
              )}
            </div>

            {selectedArticles.length > 0 && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ThunderboltOutlined />}
                  loading={generating}
                  onClick={handleGenerate}
                  style={{
                    height: 48,
                    padding: '0 36px',
                    fontWeight: 700,
                    fontSize: 15,
                    width: '100%',
                  }}
                >
                  Generate Quiz ({selectedArticles.length} article{selectedArticles.length !== 1 ? 's' : ''})
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
