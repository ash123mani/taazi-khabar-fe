'use client'

import { useEffect, useState } from 'react'
import { Typography, Spin, Button, Space } from 'antd'
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
    if (!token) return
    api
      .getHistory()
      .then((data) => setQuizzes(Array.isArray(data) ? data : data.quizzes || []))
      .catch(() => setError('Failed to load history'))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div>
      <Title level={3} style={{
        marginBottom: 4,
        letterSpacing: '-0.5px',
        color: '#1a1a1a',
      }}>
        Quiz History
      </Title>
      <Text style={{ display: 'block', marginBottom: 28, color: '#9e9e9e', fontSize: 14 }}>
        Review your past quiz attempts and performance
      </Text>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{ padding: '8px 12px', border: '1px solid #c62828', borderRadius: 4, background: '#ffebee', color: '#c62828', fontSize: 14 }}>
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
