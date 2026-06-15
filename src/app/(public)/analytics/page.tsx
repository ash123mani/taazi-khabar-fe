'use client'

import { useEffect, useState } from 'react'
import { Typography, Card, Row, Col, Statistic, Progress, Table, Button, message, Spin } from 'antd'
import dayjs from 'dayjs'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

const { Title, Text } = Typography

export default function AnalyticsPage() {
  const token = useAuthStore((s) => s.accessToken)
  const [stats, setStats] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Title level={3} style={{ color: 'var(--color-text)' }}>Please login to view analytics</Title>
        <Button type="primary" href="/login" style={{ fontWeight: 600, borderRadius: 8 }}>
          Login
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: '80px 24px' } }}>
        <Spin size="large" />
      </Card>
    )
  }

  const columns = [
    {
      title: 'Quiz',
      dataIndex: 'id',
      key: 'id',
      render: (_: string, record: any) => {
        const pct = record.total_questions ? Math.round((record.score || 0) / record.total_questions * 100) : 0
        return <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{pct}% Score</span>
      },
    },
    {
      title: 'Score',
      key: 'score',
      render: (_: any, record: any) => {
        const pct = record.total_questions ? Math.round((record.score || 0) / record.total_questions * 100) : 0
        return <span style={{ color: getColor(pct), fontWeight: 600 }}>{record.score || 0}/{record.total_questions} ({pct}%)</span>
      },
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => <span style={{ color: 'var(--color-text-tertiary)' }}>{date ? dayjs(date).format('DD-MM-YYYY') : '-'}</span>,
    },
  ]

  return (
    <div>
      <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16, color: 'var(--color-text)' }}>Analytics</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<Text style={{ color: 'var(--color-text-tertiary)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quizzes Taken</Text>}
              value={stats?.total_quizzes || 0}
              valueStyle={{ color: 'var(--color-text)', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<Text style={{ color: 'var(--color-text-tertiary)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Overall Accuracy</Text>}
              value={stats?.overall_accuracy || 0}
              suffix="%"
              valueStyle={{ color: getColor(stats?.overall_accuracy || 0), fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<Text style={{ color: 'var(--color-text-tertiary)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Questions</Text>}
              value={stats?.total_questions || 0}
              valueStyle={{ color: 'var(--color-text)', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<Text style={{ color: 'var(--color-text-tertiary)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Correct</Text>}
              value={stats?.total_correct || 0}
              valueStyle={{ color: '#22c55e', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {stats?.topics && stats.topics.length > 0 && (
        <Card style={{ marginTop: 24, background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }} styles={{ body: { padding: 22 } }}>
          <Title level={5} style={{ margin: 0, marginBottom: 16, fontSize: 14, color: 'var(--color-text)' }}>Topic-wise Breakdown</Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {stats.topics.map((topic: any) => (
              <div key={topic.topic}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ color: '#d4d4d8', fontSize: 13 }}>{topic.topic}</Text>
                  <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>{topic.correct}/{topic.total} ({topic.accuracy}%)</Text>
                </div>
                <Progress
                  percent={topic.accuracy}
                  showInfo={false}
                  strokeColor={getColor(topic.accuracy)}
                  trailColor="#27272a"
                  size="small"
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {history.length > 0 && (
        <Card style={{ marginTop: 24, background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }} styles={{ body: { padding: 22 } }}>
          <Title level={5} style={{ margin: 0, marginBottom: 16, fontSize: 14, color: 'var(--color-text)' }}>Recent Quizzes</Title>
          <Table
            columns={columns}
            dataSource={history}
            rowKey="id"
            pagination={{ pageSize: 5, showTotal: (total) => <span style={{ color: 'var(--color-text-tertiary)' }}>Total {total} quizzes</span> }}
          />
        </Card>
      )}
    </div>
  )
}
