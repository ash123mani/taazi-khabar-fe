'use client'

import { useEffect, useState } from 'react'
import { Typography, Spin, Button, Space } from 'antd'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { Quiz } from '@/lib/types'
import HistoryCard from '@/components/HistoryCard'

const { Title, Text } = Typography

export default function HistoryPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getHistory()
      .then((data) => setQuizzes(Array.isArray(data) ? data : data.quizzes || []))
      .catch(() => setError('Failed to load history'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <Title level={3} style={{
        marginBottom: 4,
        letterSpacing: '-0.5px',
        background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Quiz History
      </Title>
      <Text style={{ display: 'block', marginBottom: 28, opacity: 0.5, fontSize: 14 }}>
        Review your past quiz attempts and performance
      </Text>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{ padding: 20, border: '1px solid var(--ant-color-error)', fontSize: 14 }}>
          {error}
        </div>
      ) : quizzes.length === 0 ? (
        <div style={{
          padding: 60,
          textAlign: 'center',
        }}>
          <Text style={{ display: 'block', marginBottom: 16, fontSize: 15 }}>
            No quizzes attempted yet
          </Text>
          <Link href="/quiz">
            <Button type="primary" style={{ fontWeight: 600 }}>
              Take your first quiz
            </Button>
          </Link>
        </div>
      ) : (
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          {quizzes.map((quiz) => (
            <HistoryCard key={quiz.id} quiz={quiz} />
          ))}
        </Space>
      )}
    </div>
  )
}
