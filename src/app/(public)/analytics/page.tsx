'use client'

import { useEffect, useState } from 'react'
import { Typography, Button, message, Spin } from 'antd'
import dayjs from 'dayjs'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useIsMobile } from '@/hooks/useIsMobile'

const { Text } = Typography

export default function AnalyticsPage() {
  const token = useAuthStore((s) => s.accessToken)
  const [stats, setStats] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    Promise.all([
      api.getPerformance(),
      api.getHistory(),
    ])
      .then(([statsData, historyData]) => {
        setStats(statsData)
        const list = Array.isArray(historyData) ? historyData : historyData.quizzes || []
        setHistory(list)
      })
      .catch(() => message.error('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [token])

  const getColor = (acc: number) => {
    if (acc >= 70) return '#22c55e'
    if (acc >= 50) return '#eab308'
    return '#ef4444'
  }

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div className="newspaper-heading" style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
          Please login to view analytics
        </div>
        <Button type="primary" href="/login" style={{ fontWeight: 600, borderRadius: 2, letterSpacing: '0.5px', fontSize: 12, height: 36, padding: '0 24px' }}>
          Login
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
      </div>
    )
  }

  const statCards = [
    { label: 'Quizzes Taken', value: stats?.total_quizzes || 0, color: 'var(--color-text)' },
    { label: 'Overall Accuracy', value: `${stats?.overall_accuracy || 0}%`, color: getColor(stats?.overall_accuracy || 0) },
    { label: 'Questions', value: stats?.total_questions || 0, color: 'var(--color-text)' },
    { label: 'Correct', value: stats?.total_correct || 0, color: '#22c55e' },
  ]

  return (
    <div>
      <div style={{
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: isMobile ? 8 : 12,
        marginBottom: isMobile ? 10 : 16,
      }}>
        <div className="newspaper-heading" style={{
          fontWeight: 800,
          fontSize: isMobile ? 20 : 26,
          letterSpacing: '-0.3px',
          color: 'var(--color-text)',
          lineHeight: 1.15,
        }}>
          Your Performance
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: 0,
        borderBottom: '1px solid var(--color-border)',
        marginBottom: isMobile ? 10 : 16,
      }}>
        {statCards.map((stat, idx) => (
          <div key={stat.label} style={{
            padding: isMobile ? '12px 10px' : '16px 14px',
            borderRight: !isMobile && idx < statCards.length - 1 ? '1px solid var(--color-border)' : 'none',
            borderBottom: isMobile && idx < 2 ? '1px solid var(--color-border)' : 'none',
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
            <div className="newspaper-heading" style={{
              fontWeight: 700,
              fontSize: isMobile ? 20 : 24,
              color: stat.color,
              lineHeight: 1,
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {stats?.topics && stats.topics.length > 0 && (
        <div style={{
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: isMobile ? 10 : 14,
          marginBottom: isMobile ? 10 : 16,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: isMobile ? 10 : 14,
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
              Topic Breakdown
            </Text>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 6 : 10 }}>
            {stats.topics.map((topic: any) => {
              const pct = topic.accuracy
              return (
                <div key={topic.topic}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <Text style={{ fontSize: isMobile ? 11 : 12, color: 'var(--color-text-secondary)' }}>
                      {topic.topic}
                    </Text>
                    <Text style={{ fontSize: isMobile ? 10 : 11, color: 'var(--color-text-tertiary)' }}>
                      {topic.correct}/{topic.total} ({pct}%)
                    </Text>
                  </div>
                  <div style={{ height: 3, background: 'var(--color-border)', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: getColor(pct), transition: 'width 0.3s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
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
              Recent Quizzes
            </Text>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {history.slice(0, 5).map((quiz: any) => {
              const pct = quiz.total_questions ? Math.round((quiz.score || 0) / quiz.total_questions * 100) : 0
              return (
                <div key={quiz.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: isMobile ? '8px 0' : '10px 0',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  <div>
                    <div className="newspaper-heading" style={{
                      fontSize: isMobile ? 13 : 14,
                      fontWeight: 600,
                      color: 'var(--color-text)',
                    }}>{pct}% Score</div>
                    <Text style={{ fontSize: isMobile ? 9 : 10, color: 'var(--color-text-tertiary)', display: 'block', marginTop: 1 }}>
                      {quiz.score || 0}/{quiz.total_questions} questions
                    </Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text style={{ fontSize: isMobile ? 12 : 14, color: getColor(pct), fontWeight: 700 }}>{pct}%</Text>
                    <Text style={{ fontSize: isMobile ? 9 : 9, color: 'var(--color-text-tertiary)', display: 'block', marginTop: 1 }}>
                      {quiz.created_at ? dayjs(quiz.created_at).format('DD-MM-YYYY') : '-'}
                    </Text>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
