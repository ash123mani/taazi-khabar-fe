'use client'

import { useEffect, useState } from 'react'
import { Typography, Spin, Card, Progress, Row, Col, Statistic, Space, Button } from 'antd'
import { TrophyOutlined, CheckCircleOutlined, QuestionCircleOutlined, BookOutlined } from '@ant-design/icons'
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
    if (acc >= 70) return '#2e7d32'
    if (acc >= 50) return '#e65100'
    return '#c62828'
  }

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <TrophyOutlined style={{ fontSize: 40, color: '#d0d0d0', display: 'block', marginBottom: 16 }} />
        <Text style={{ display: 'block', fontSize: 15, color: '#9e9e9e' }}>
          Please login to view your performance
        </Text>
        <Link href="/login" style={{ display: 'inline-block', marginTop: 12 }}>
          <Button type="primary" style={{ fontWeight: 600 }}>Login</Button>
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '10px 14px', border: '1px solid #c62828', borderRadius: 6, background: '#ffebee', color: '#c62828', fontSize: 14 }}>
        {error}
      </div>
    )
  }

  if (!data || data.total_questions === 0) {
    return (
      <div style={{ padding: 80, textAlign: 'center' }}>
        <TrophyOutlined style={{ fontSize: 40, color: '#d0d0d0', display: 'block', marginBottom: 16 }} />
        <Text style={{ display: 'block', fontSize: 15, color: '#9e9e9e' }}>
          No quiz data yet. Take some quizzes to see your performance!
        </Text>
        <Link href="/quiz" style={{ display: 'inline-block', marginTop: 12 }}>
          <Button type="primary" style={{ fontWeight: 600 }}>Take a Quiz</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px' }}>
        Performance Analytics
      </Title>
      <Text style={{ display: 'block', marginBottom: 24, color: '#9e9e9e', fontSize: 14 }}>
        Track your UPSC topic-wise progress
      </Text>

      <Row gutter={16} style={{ marginBottom: 28 }}>
        <Col xs={12} sm={6}>
          <Card className="article-card" styles={{ body: { padding: 16, textAlign: 'center' } }}>
            <Statistic
              title="Overall Accuracy"
              value={data.overall_accuracy}
              suffix="%"
              valueStyle={{ color: getColor(data.overall_accuracy), fontWeight: 700 }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="article-card" styles={{ body: { padding: 16, textAlign: 'center' } }}>
            <Statistic
              title="Quizzes Taken"
              value={data.total_quizzes}
              valueStyle={{ color: '#1a1a1a', fontWeight: 700 }}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="article-card" styles={{ body: { padding: 16, textAlign: 'center' } }}>
            <Statistic
              title="Questions"
              value={data.total_questions}
              valueStyle={{ color: '#1a1a1a', fontWeight: 700 }}
              prefix={<QuestionCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="article-card" styles={{ body: { padding: 16, textAlign: 'center' } }}>
            <Statistic
              title="Correct"
              value={data.total_correct}
              suffix={`/ ${data.total_questions}`}
              valueStyle={{ color: '#2e7d32', fontWeight: 700 }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Title level={5} style={{ marginBottom: 16 }}>Topic-wise Breakdown</Title>

      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {data.topics.map((topic) => {
          const { short, full } = shortenTag(topic.topic)
          return (
            <Card key={topic.topic} className="article-card" styles={{ body: { padding: '14px 18px' } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                <Text strong style={{ fontSize: 13, color: '#1a1a1a' }} title={full}>{short}</Text>
                <Text style={{ fontSize: 12, color: '#888' }}>
                  {topic.correct}/{topic.total} ({topic.accuracy}%)
                </Text>
              </div>
              <Progress
                percent={topic.accuracy}
                showInfo={false}
                strokeColor={getColor(topic.accuracy)}
                trailColor="#e8e8e8"
                size="small"
              />
            </Card>
          )
        })}
      </Space>
    </div>
  )
}
