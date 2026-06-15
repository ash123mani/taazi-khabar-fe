'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Typography, Spin, Button, Space, Card } from 'antd'


import dayjs from 'dayjs'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import type { Quiz } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'
import QuizQuestionComponent from '@/components/QuizQuestion'

const { Title, Text } = Typography

export default function HistoryDetailPage() {
  const params = useParams()
  const id = params.id as string
  const token = useAuthStore((s) => s.accessToken)

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    if (!token) {
      setLoading(false)
      setError('Please login to view quiz details')
      return
    }
    api
      .getHistoryDetail(id)
      .then(setQuiz)
      .catch(() => setError('Failed to load quiz details'))
      .finally(() => setLoading(false))
  }, [id, token])

  if (loading) {
    return (
      <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: '80px 24px' } }}>
        <Spin size="large" />
      </Card>
    )
  }

  if (error) {
    const isAuthError = error === 'Please login to view quiz details'
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <div style={{ padding: '10px 14px', border: '1px solid #ef4444', borderRadius: 6, background: 'rgba(239,68,68,0.1)', color: '#fca5a5', marginBottom: 16, fontSize: 14, display: 'inline-block' }}>
          {error}
        </div>
        {isAuthError ? (
          <Link href="/login">
            <Button type="primary" style={{ fontWeight: 600, borderRadius: 8 }}>
              Login
            </Button>
          </Link>
        ) : (
          <Button onClick={() => window.location.reload()} type="default" style={{ fontWeight: 600, borderRadius: 8 }}>
            Retry
          </Button>
        )}
      </div>
    )
  }

  if (!quiz) return null

  const percentage = quiz.score !== null
    ? Math.round((quiz.score / quiz.total_questions) * 100)
    : null

  const scoreColor = percentage !== null
    ? percentage >= 60 ? '#22c55e' : percentage >= 30 ? '#eab308' : '#ef4444'
    : '#6b6b6b'

  return (
    <div>
      <Card style={{ padding: 22, marginBottom: 28, background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }}>
        <Title level={4} style={{ margin: 0, marginBottom: 18, fontSize: 16, color: 'var(--color-text)' }}>
          {quiz.title || 'Quiz Details'}
        </Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14 }}>
          <div>
            <Text style={{ fontSize: 11, display: 'block', marginBottom: 4, color: 'var(--color-text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Score</Text>
            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: 6,
              border: `1px solid ${scoreColor}`,
              fontWeight: 700,
              fontSize: 15,
              color: scoreColor,
              background: `${scoreColor}15`,
            }}>
              {quiz.score}/{quiz.total_questions}
              {percentage !== null && ` (${percentage}%)`}
            </div>
          </div>
          <div>
            <Text style={{ fontSize: 11, display: 'block', marginBottom: 4, color: 'var(--color-text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</Text>
            <Text style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
              {dayjs(quiz.created_at).format('DD-MM-YYYY')}
            </Text>
          </div>
          <div>
            <Text style={{ fontSize: 11, display: 'block', marginBottom: 4, color: 'var(--color-text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</Text>
            <Text style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
              {quiz.time_taken_sec ? `${Math.floor(quiz.time_taken_sec / 60)}m ${quiz.time_taken_sec % 60}s` : 'N/A'}
            </Text>
          </div>
          <div>
            <Text style={{ fontSize: 11, display: 'block', marginBottom: 4, color: 'var(--color-text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Articles</Text>
            <Text style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{quiz.articles?.length || 0}</Text>
          </div>
        </div>
      </Card>

      {quiz.articles && quiz.articles.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 12, color: 'var(--color-text)' }}>Linked Articles</Text>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {quiz.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </Space>
        </div>
      )}

      <div>
        <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 14, color: 'var(--color-text)' }}>Questions & Answers</Text>
        {quiz.questions?.map((question, i) => (
          <QuizQuestionComponent
            key={question.id}
            question={question}
            index={i}
            selected={question.selected_answer || null}
            onSelect={() => {}}
            showResults
          />
        ))}
      </div>
    </div>
  )
}
