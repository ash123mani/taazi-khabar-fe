'use client'

import { useEffect, useState } from 'react'
import { Typography, Spin, Button, Space, Card, Row, Col, Statistic } from 'antd'
import { HistoryOutlined, TrophyOutlined, ClockCircleOutlined, StarOutlined, FireOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import type { Quiz } from '@/lib/types'
import HistoryCard from '@/components/HistoryCard'

const { Title, Text } = Typography

export default function HistoryPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const token = useAuthStore((s) => s.accessToken)

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
      <Card style={{ marginBottom: 28, borderRadius: 16, background: '#0a0a0a', border: '1px solid #1f1f1f' }} styles={{ body: { padding: '24px 28px' } }}>
        <Row justify="space-between" align="middle">
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HistoryOutlined style={{ fontSize: 20, color: '#ffffff' }} />
              </div>
              <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px', fontWeight: 700, color: '#ffffff' }}>
                Quiz History
              </Title>
            </div>
            <Text style={{ color: '#6b6b6b', fontSize: 14, display: 'block', marginTop: 4, marginLeft: 52 }}>
              Review your past quiz attempts and performance
            </Text>
          </Col>
          {quizzes.length > 0 && (
            <Col>
              <Space size={20}>
                <Statistic
                  title={<Text style={{ color: '#6b6b6b', fontSize: 12 }}>Total Quizzes</Text>}
                  value={quizzes.length}
                  prefix={<TrophyOutlined style={{ color: '#eab308' }} />}
                  valueStyle={{ fontWeight: 700, color: '#ffffff' }}
                />
                <Statistic
                  title={<Text style={{ color: '#6b6b6b', fontSize: 12 }}>Avg Score</Text>}
                  value={avgScore}
                  suffix="%"
                  prefix={<StarOutlined style={{ color: '#6366f1' }} />}
                  valueStyle={{ fontWeight: 700, color: getScoreColor(avgScore) }}
                />
              </Space>
            </Col>
          )}
        </Row>
      </Card>

      {loading ? (
        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: '#0a0a0a', border: '1px solid #1f1f1f' }} styles={{ body: { padding: '80px 24px' } }}>
          <Spin size="large" />
        </Card>
      ) : !token ? (
        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: '#0a0a0a', border: '1px solid #1f1f1f' }} styles={{ body: { padding: '80px 24px' } }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: '#141414', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <HistoryOutlined style={{ fontSize: 32, color: '#4a4a4a' }} />
          </div>
          <Title level={4} style={{ margin: 0, marginBottom: 8, color: '#a1a1a1' }}>Please login to view your quiz history</Title>
          <Text style={{ color: '#6b6b6b', fontSize: 14, display: 'block', marginBottom: 24 }}>Track your progress and improve your scores</Text>
          <Link href="/login">
            <Button type="primary" size="large" icon={<ClockCircleOutlined />} style={{ fontWeight: 600, borderRadius: 10, height: 44, padding: '0 28px' }}>
              Login
            </Button>
          </Link>
        </Card>
      ) : error ? (
        <Card style={{ borderRadius: 12, background: '#141414', border: '1px solid #ef4444' }} styles={{ body: { padding: '16px 20px' } }}>
          <Text style={{ color: '#fca5a5' }}>{error}</Text>
        </Card>
      ) : quizzes.length === 0 ? (
        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: '#0a0a0a', border: '1px solid #1f1f1f' }} styles={{ body: { padding: '80px 24px' } }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: '#141414', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <TrophyOutlined style={{ fontSize: 32, color: '#4a4a4a' }} />
          </div>
          <Title level={4} style={{ margin: 0, marginBottom: 8, color: '#a1a1a1' }}>No quizzes attempted yet</Title>
          <Text style={{ color: '#6b6b6b', fontSize: 14, display: 'block', marginBottom: 24 }}>Start your first quiz to track your progress</Text>
          <Link href="/quiz">
            <Button type="primary" size="large" icon={<FireOutlined />} style={{ fontWeight: 600, borderRadius: 10, height: 44, padding: '0 28px' }}>
              Take your first quiz
            </Button>
          </Link>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {quizzes.map((quiz) => (
            <HistoryCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  )
}
