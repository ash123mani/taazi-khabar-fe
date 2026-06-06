'use client'

import { Card, Typography, Space } from 'antd'
import Link from 'next/link'
import type { Quiz } from '@/lib/types'

const { Text } = Typography

export default function HistoryCard({ quiz }: { quiz: Quiz }) {
  const percentage = quiz.score !== null
    ? Math.round((quiz.score / quiz.total_questions) * 100)
    : null

  return (
    <Link href={`/history/${quiz.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <Card
        hoverable
        className="article-card fade-in"
        styles={{ body: { padding: 20 } }}
        style={{ marginBottom: 12 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 12, color: '#9e9e9e' }}>
            {new Date(quiz.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </Text>
          {percentage !== null && (
            <div style={{
              padding: '2px 10px',
              borderRadius: 4,
              border: '1px solid',
              fontWeight: 700,
              fontSize: 12,
              background: '#f5f5f5',
              borderColor: '#e0e0e0',
              color: '#1a1a1a',
            }}>
              {percentage}%
            </div>
          )}
        </div>
        <Text strong style={{ display: 'block', marginBottom: 10, fontSize: 15, color: '#1a1a1a' }}>
          {quiz.title || 'Untitled Quiz'}
        </Text>
        <Space size={16}>
          <Text style={{ fontSize: 13, color: '#9e9e9e' }}>{quiz.total_questions} questions</Text>
          {quiz.score !== null && (
            <Text style={{ fontSize: 13, color: '#9e9e9e' }}>
              {quiz.score}/{quiz.total_questions} correct
            </Text>
          )}
          <Text style={{ fontSize: 13, color: '#9e9e9e' }}>{quiz.articles?.length || 0} articles</Text>
        </Space>
      </Card>
    </Link>
  )
}
