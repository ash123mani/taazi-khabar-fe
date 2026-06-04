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
        className="glass-card fade-in"
        styles={{ body: { padding: 20 } }}
        style={{ marginBottom: 12 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>
            {new Date(quiz.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </Text>
          {percentage !== null && (
            <div style={{
              padding: '2px 10px',
              borderRadius: 6,
              border: '1px solid',
              fontWeight: 700,
              fontSize: 12,
              background: 'rgba(99, 102, 241, 0.08)',
              borderColor: 'rgba(99, 102, 241, 0.2)',
            }}>
              {percentage}%
            </div>
          )}
        </div>
        <Text strong style={{ display: 'block', marginBottom: 10, fontSize: 15 }}>
          {quiz.title || 'Untitled Quiz'}
        </Text>
        <Space size={16}>
          <Text style={{ fontSize: 13, opacity: 0.7 }}>{quiz.total_questions} questions</Text>
          {quiz.score !== null && (
            <Text style={{ fontSize: 13, opacity: 0.7 }}>
              {quiz.score}/{quiz.total_questions} correct
            </Text>
          )}
          <Text style={{ fontSize: 13, opacity: 0.7 }}>{quiz.articles?.length || 0} articles</Text>
        </Space>
      </Card>
    </Link>
  )
}
