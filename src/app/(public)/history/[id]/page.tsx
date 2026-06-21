'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Typography, Spin, Button, Collapse } from 'antd'

import dayjs from 'dayjs'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Quiz } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'
import QuizQuestionComponent from '@/components/QuizQuestion'

const { Text } = Typography

export default function HistoryDetailPage() {
  const params = useParams()
  const id = params.id as string
  const token = useAuthStore((s) => s.accessToken)
  const isMobile = useIsMobile()

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
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    const isAuthError = error === 'Please login to view quiz details'
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ padding: '6px 10px', border: '1px solid #ef4444', color: '#ef4444', marginBottom: 12, fontSize: 12, display: 'inline-block' }}>
          {error}
        </div>
        {isAuthError ? (
          <Link href="/login">
            <Button type="primary" style={{ fontWeight: 600, borderRadius: 2, letterSpacing: '0.5px', fontSize: 12 }}>
              Login
            </Button>
          </Link>
        ) : (
          <Button onClick={() => window.location.reload()} type="default" style={{ fontWeight: 600, borderRadius: 2, fontSize: 12 }}>
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
      <div style={{
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: isMobile ? 8 : 12,
        marginBottom: isMobile ? 10 : 16,
      }}>
        <div className="newspaper-heading" style={{
          fontWeight: 800,
          fontSize: isMobile ? 18 : 24,
          letterSpacing: '-0.3px',
          color: 'var(--color-text)',
          lineHeight: 1.15,
        }}>
          {quiz.title || 'Quiz Details'}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: 10,
        marginBottom: isMobile ? 14 : 20,
      }}>
        {[
          { label: 'Score', value: <span style={{ color: scoreColor }}>{quiz.score}/{quiz.total_questions}{percentage !== null ? <span style={{ fontSize: isMobile ? 11 : 13, marginLeft: 4, color: 'var(--color-text-tertiary)' }}>({percentage}%)</span> : null}</span> },
          { label: 'Date', value: dayjs(quiz.created_at).format('DD-MM-YYYY') },
          { label: 'Time', value: quiz.time_taken_sec ? `${Math.floor(quiz.time_taken_sec / 60)}m ${quiz.time_taken_sec % 60}s` : 'N/A' },
          { label: 'Articles', value: quiz.articles?.length || 0 },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'var(--color-surface)',
            borderRadius: 12,
            padding: isMobile ? 12 : 16,
            border: '1px solid var(--color-border)',
          }}>
            <Text style={{
              fontSize: 8,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: 'var(--color-text-tertiary)',
              display: 'block',
              marginBottom: 4,
            }}>
              {stat.label}
            </Text>
            <Text style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: 'var(--color-text)' }}>
              {stat.value}
            </Text>
          </div>
        ))}
      </div>

      {quiz.articles && quiz.articles.length > 0 && (
        <div style={{ marginBottom: isMobile ? 14 : 20 }}>
          <Collapse
            ghost
            style={{ margin: 0, padding: 0, borderBottom: '1px solid var(--color-border)' }}
            styles={{ header: { padding: '6px 0' }, body: { padding: '0 0 10px' } }}
            items={[{
              key: 'articles',
              label: (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                  <Text style={{
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-tertiary)',
                    whiteSpace: 'nowrap',
                  }}>
                    Linked Articles ({quiz.articles.length})
                  </Text>
                  <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                </div>
              ),
              children: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {quiz.articles.map((article) => (
                    <div key={article.id} style={{ borderTop: '1px solid var(--color-border)', padding: isMobile ? '6px 0' : '10px 0' }}>
                      <ArticleCard article={article} />
                    </div>
                  ))}
                </div>
              ),
            }]}
          />
        </div>
      )}

      <div style={{ marginTop: isMobile ? 10 : 14 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: isMobile ? 8 : 12,
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          <Text style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            whiteSpace: 'nowrap',
          }}>
            Questions &amp; Answers
          </Text>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
        </div>

        {quiz.questions?.map((question, i) => (
          <div key={question.id} style={{
            background: 'var(--color-surface)',
            borderRadius: 12,
            padding: isMobile ? 14 : 18,
            marginBottom: 12,
            border: '1px solid var(--color-border)',
          }}>
            <QuizQuestionComponent
              question={question}
              index={i}
              selected={question.selected_answer || null}
              onSelect={() => {}}
              showResults
            />
          </div>
        ))}
      </div>
    </div>
  )
}
