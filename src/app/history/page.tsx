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
      <Title level={3} style={{ marginBottom: 4, letterSpacing: '-0.5px' }}>Quiz History</Title>
      <Text style={{ color: '#666', display: 'block', marginBottom: 24 }}>
        Review your past quiz attempts and performance
      </Text>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{ padding: 20, border: '2px solid #000', fontSize: 14, color: '#666' }}>
          {error}
        </div>
      ) : quizzes.length === 0 ? (
        <div style={{
          padding: 60,
          border: '2px solid #000',
          textAlign: 'center',
          background: '#fff',
        }}>
          <Text style={{ color: '#666', display: 'block', marginBottom: 16, fontSize: 15 }}>
            No quizzes attempted yet
          </Text>
          <Link href="/quiz">
            <Button type="primary" style={{ borderRadius: 0, border: '2px solid #000', fontWeight: 600 }}>
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
