'use client'

import { useEffect, useState } from 'react'
import { Typography, Spin, Button } from 'antd'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Quiz } from '@/lib/types'
import HistoryCard from '@/components/HistoryCard'

const { Text } = Typography

export default function HistoryPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const token = useAuthStore((s) => s.accessToken)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    api
      .getHistory()
      .then((data) => setQuizzes(Array.isArray(data) ? data : data.quizzes || []))
      .catch(() => setError('Failed to load history'))
      .finally(() => setLoading(false))
  }, [token])

  const avgScore = quizzes.length > 0
    ? Math.round(quizzes.reduce((sum, q) => sum + (q.score || 0), 0) / quizzes.length)
    : 0

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#22c55e'
    if (score >= 50) return '#eab308'
    return '#ef4444'
  }

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
          Archives
        </div>
      </div>

      {quizzes.length > 0 && (
        <div style={{
          display: 'flex',
          gap: isMobile ? 12 : 20,
          marginBottom: isMobile ? 14 : 20,
          paddingBottom: isMobile ? 10 : 14,
          borderBottom: '1px solid var(--color-border)',
          flexWrap: 'wrap',
        }}>
          <div>
            <Text style={{
              fontSize: 8,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: 'var(--color-text-tertiary)',
              display: 'block',
              marginBottom: 2,
            }}>
              Total Quizzes
            </Text>
            <div className="newspaper-heading" style={{
              fontWeight: 700,
              fontSize: 16,
              color: 'var(--color-text)',
            }}>
              {quizzes.length}
            </div>
          </div>
          <div style={{ width: 1, background: 'var(--color-border)', alignSelf: 'stretch' }} />
          <div>
            <Text style={{
              fontSize: 8,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: 'var(--color-text-tertiary)',
              display: 'block',
              marginBottom: 2,
            }}>
              Avg Score
            </Text>
            <div className="newspaper-heading" style={{
              fontWeight: 700,
              fontSize: 16,
              color: getScoreColor(avgScore),
            }}>
              {avgScore}%
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : !token ? (
        <div style={{ padding: isMobile ? '32px 12px' : '48px 16px', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
          <div className="newspaper-heading" style={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            Please login to view your quiz history
          </div>
          <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 12, display: 'block', marginBottom: 16 }}>
            Track your progress and improve your scores
          </Text>
          <Link href="/login">
            <Button type="primary" size="middle" style={{ fontWeight: 600, borderRadius: 2, letterSpacing: '0.5px', height: 36, padding: '0 24px', fontSize: 12 }}>
              Login
            </Button>
          </Link>
        </div>
      ) : error ? (
        <div style={{ padding: '6px 10px', border: '1px solid #ef4444', color: '#ef4444', fontSize: 12, display: 'inline-block' }}>
          {error}
        </div>
      ) : quizzes.length === 0 ? (
        <div style={{ padding: isMobile ? '32px 12px' : '48px 16px', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
          <div className="newspaper-heading" style={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            No quizzes attempted yet
          </div>
          <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 12, display: 'block', marginBottom: 16 }}>
            Start your first quiz to track your progress
          </Text>
          <Link href="/quiz">
            <Button type="primary" size="middle" style={{ fontWeight: 600, borderRadius: 2, letterSpacing: '0.5px', height: 36, padding: '0 24px', fontSize: 12 }}>
              Take your first quiz
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: isMobile ? 4 : 8,
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
              {quizzes.length} Quiz{quizzes.length !== 1 ? 'zes' : ''}
            </Text>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {quizzes.map((quiz) => (
              <div key={quiz.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <HistoryCard quiz={quiz} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
