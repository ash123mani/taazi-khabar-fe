'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Typography, Spin, Button, Space } from 'antd'
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
    if (!id || !token) return
    api
      .getHistoryDetail(id)
      .then(setQuiz)
      .catch(() => setError('Failed to load quiz details'))
      .finally(() => setLoading(false))
  }, [id, token])

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: 48 }}>
        <div style={{ padding: '8px 12px', border: '1px solid #c62828', borderRadius: 4, background: '#ffebee', color: '#c62828', marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
        <Button onClick={() => window.location.reload()} style={{ fontWeight: 600 }}>
          Retry
        </Button>
      </div>
    )
  }

  if (!quiz) return null

  const percentage = quiz.score !== null
    ? Math.round((quiz.score / quiz.total_questions) * 100)
    : null

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="article-card" style={{
        padding: 24,
        marginBottom: 32,
      }}>
        <Title level={4} style={{ margin: 0, marginBottom: 20 }}>{quiz.title || 'Quiz Details'}</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
          <div>
            <Text style={{ fontSize: 12, display: 'block', marginBottom: 4, color: '#9e9e9e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Score</Text>
            <div style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              fontWeight: 700,
              fontSize: 15,
            }}>
              {quiz.score}/{quiz.total_questions}
              {percentage !== null && ` (${percentage}%)`}
            </div>
          </div>
          <div>
            <Text style={{ fontSize: 12, display: 'block', marginBottom: 4, color: '#9e9e9e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</Text>
            <Text style={{ fontSize: 14 }}>
              {new Date(quiz.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </Text>
          </div>
          <div>
            <Text style={{ fontSize: 12, display: 'block', marginBottom: 4, color: '#9e9e9e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time Taken</Text>
            <Text style={{ fontSize: 14 }}>
              {quiz.time_taken_sec
                ? `${Math.floor(quiz.time_taken_sec / 60)}m ${quiz.time_taken_sec % 60}s`
                : 'N/A'}
            </Text>
          </div>
          <div>
            <Text style={{ fontSize: 12, display: 'block', marginBottom: 4, color: '#9e9e9e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Articles</Text>
            <Text style={{ fontSize: 14 }}>{quiz.articles?.length || 0}</Text>
          </div>
        </div>
      </div>

      {quiz.articles && quiz.articles.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <Title level={5} style={{ marginBottom: 16 }}>Linked Articles</Title>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {quiz.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </Space>
        </div>
      )}

      <div>
        <Title level={5} style={{ marginBottom: 16 }}>Questions &amp; Answers</Title>
        {quiz.questions?.map((question, i) => (
          <QuizQuestionComponent
            key={question.id}
            question={question}
            index={i}
            selected={question.correct_answer || null}
            onSelect={() => {}}
            showResults
          />
        ))}
      </div>
    </div>
  )
}
