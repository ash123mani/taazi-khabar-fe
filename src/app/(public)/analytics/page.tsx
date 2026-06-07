'use client'

import { useEffect, useState } from 'react'
import { Typography, Spin, Card, Progress, Row, Col, Statistic, Space, Button, Table, Tag } from 'antd'
import { TrophyOutlined, CheckCircleOutlined, QuestionCircleOutlined, BookOutlined, FireOutlined, AimOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

const { Title, Text } = Typography

const TOPIC_SHORT: Record<string, string> = {
  'GS Paper 1': 'GS-I',
  'GS Paper 2': 'GS-II',
  'GS Paper 3': 'GS-III',
  'GS Paper 4': 'GS-IV',
}

function shortenTag(tag: string): { short: string; full: string } {
  for (const [prefix, short] of Object.entries(TOPIC_SHORT)) {
    if (tag.startsWith(prefix)) {
      const rest = tag.replace(prefix, '').replace(/^ — /, '')
      return { short: `${short}: ${rest}`, full: tag }
    }
  }
  if (tag.length > 50) return { short: tag.slice(0, 47) + '...', full: tag }
  return { short: tag, full: tag }
}

interface TopicData {
  topic: string
  total: number
  correct: number
  accuracy: number
}

interface PerformanceData {
  topics: TopicData[]
  total_questions: number
  total_correct: number
  overall_accuracy: number
  total_quizzes: number
}

export default function AnalyticsPage() {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const token = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    api.getPerformance()
      .then(setData)
      .catch(() => setError('Failed to load performance data'))
      .finally(() => setLoading(false))
  }, [token])

  const getColor = (acc: number) => {
    if (acc >= 70) return '#10b981'
    if (acc >= 50) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreLabel = (acc: number) => {
    if (acc >= 70) return 'Excellent'
    if (acc >= 50) return 'Good'
    return 'Needs Practice'
  }

  const columns = [
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      render: (text: string) => {
        const { short, full } = shortenTag(text)
        return <Text strong style={{ color: '#fafafa' }} title={full}>{short}</Text>
      },
    },
    {
      title: 'Questions',
      dataIndex: 'total',
      key: 'total',
      align: 'center' as const,
      render: (val: number) => <Text style={{ color: '#a1a1aa' }}>{val}</Text>,
    },
    {
      title: 'Correct',
      dataIndex: 'correct',
      key: 'correct',
      align: 'center' as const,
      render: (val: number) => <Text style={{ color: '#10b981', fontWeight: 600 }}>{val}</Text>,
    },
    {
      title: 'Accuracy',
      dataIndex: 'accuracy',
      key: 'accuracy',
      align: 'center' as const,
      render: (val: number) => (
        <Space>
          <Progress
            type="circle"
            size={48}
            percent={val}
            strokeColor={getColor(val)}
            trailColor="#27272a"
            format={() => `${val}%`}
          />
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      align: 'center' as const,
        render: (_: any, record: TopicData) => (
        <Tag color={record.accuracy >= 70 ? 'success' : record.accuracy >= 50 ? 'warning' : 'error'} style={{ borderRadius: 6, fontWeight: 500 }}>
          {getScoreLabel(record.accuracy)}
        </Tag>
      ),
    },
  ]

  if (!token) {
    return (
      <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '80px 24px' } }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: '#1c1c1f', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <TrophyOutlined style={{ fontSize: 32, color: '#71717a' }} />
        </div>
        <Title level={4} style={{ margin: 0, marginBottom: 8, color: '#d4d4d8' }}>Please login to view your performance</Title>
        <Text style={{ color: '#a1a1aa', fontSize: 14, display: 'block', marginBottom: 24 }}>Track your progress and improve your scores</Text>
        <Link href="/login">
          <Button type="primary" size="large" icon={<BookOutlined />} style={{ fontWeight: 600, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none', height: 44, padding: '0 28px' }}>
            Login
          </Button>
        </Link>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '80px 24px' } }}>
        <Spin size="large" />
      </Card>
    )
  }

  if (error) {
    return (
      <Card style={{ borderRadius: 12, background: '#1c1c1f', border: '1px solid #ef4444' }} styles={{ body: { padding: '16px 20px' } }}>
        <Text style={{ color: '#fca5a5' }}>{error}</Text>
      </Card>
    )
  }

  if (!data || data.total_questions === 0) {
    return (
      <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '80px 24px' } }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: '#1c1c1f', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <TrophyOutlined style={{ fontSize: 32, color: '#71717a' }} />
        </div>
        <Title level={4} style={{ margin: 0, marginBottom: 8, color: '#d4d4d8' }}>No quiz data yet</Title>
        <Text style={{ color: '#a1a1aa', fontSize: 14, display: 'block', marginBottom: 24 }}>Take some quizzes to see your performance!</Text>
        <Link href="/quiz">
          <Button type="primary" size="large" icon={<QuestionCircleOutlined />} style={{ fontWeight: 600, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none', height: 44, padding: '0 28px' }}>
            Take a Quiz
          </Button>
        </Link>
      </Card>
    )
  }

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: 28, borderRadius: 16, background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '24px 28px' } }}>
        <Row justify="space-between" align="middle">
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AimOutlined style={{ fontSize: 20, color: '#fff' }} />
              </div>
              <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px', fontWeight: 700, color: '#fafafa' }}>
                Performance Analytics
              </Title>
            </div>
            <Text style={{ color: '#a1a1aa', fontSize: 14, display: 'block', marginTop: 4, marginLeft: 52 }}>
              Track your UPSC topic-wise progress
            </Text>
          </Col>
          <Col>
            <Space size={20}>
              <Statistic
                title={<Text style={{ color: '#a1a1aa', fontSize: 12 }}>Quizzes</Text>}
                value={data.total_quizzes}
                prefix={<FireOutlined style={{ color: '#f59e0b' }} />}
                valueStyle={{ fontWeight: 700, color: '#fafafa' }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Stats Grid */}
      <Row gutter={16} style={{ marginBottom: 28 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 14, textAlign: 'center', background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic
              title={<Text style={{ color: '#a1a1aa', fontSize: 13 }}>Overall Accuracy</Text>}
              value={data.overall_accuracy}
              suffix="%"
              valueStyle={{ color: getColor(data.overall_accuracy), fontWeight: 700, fontSize: 24 }}
              prefix={<TrophyOutlined style={{ color: getColor(data.overall_accuracy) }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 14, textAlign: 'center', background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic
              title={<Text style={{ color: '#a1a1aa', fontSize: 13 }}>Questions</Text>}
              value={data.total_questions}
              valueStyle={{ fontWeight: 700, color: '#fafafa', fontSize: 24 }}
              prefix={<QuestionCircleOutlined style={{ color: '#6366f1' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 14, textAlign: 'center', background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic
              title={<Text style={{ color: '#a1a1aa', fontSize: 13 }}>Correct</Text>}
              value={data.total_correct}
              suffix={`/ ${data.total_questions}`}
              valueStyle={{ fontWeight: 700, color: '#10b981', fontSize: 24 }}
              prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 14, textAlign: 'center', background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic
              title={<Text style={{ color: '#a1a1aa', fontSize: 13 }}>Topics</Text>}
              value={data.topics.length}
              prefix={<BookOutlined style={{ color: '#8b5cf6' }} />}
              valueStyle={{ fontWeight: 700, color: '#fafafa', fontSize: 24 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Topic Breakdown Table */}
      <Card style={{ borderRadius: 14, background: '#141416', border: '1px solid #27272a' }} styles={{ body: { padding: '24px' } }}>
        <Title level={4} style={{ margin: 0, marginBottom: 20, color: '#fafafa', letterSpacing: '-0.5px' }}>
          Topic-wise Breakdown
        </Title>
        <Table
          dataSource={data.topics.map((topic, index) => ({ ...topic, key: index }))}
          columns={columns}
          pagination={false}
          size="middle"
          style={{ background: 'transparent' }}
        />
      </Card>
    </div>
  )
}
