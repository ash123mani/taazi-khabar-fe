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
        style={{
          border: '2px solid #000',
          borderRadius: 0,
          boxShadow: 'none',
          marginBottom: 12,
        }}
        styles={{ body: { padding: 20 } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: '#999', fontSize: 12 }}>
            {new Date(quiz.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </Text>
          {percentage !== null && (
            <div style={{
              padding: '2px 8px',
              border: '2px solid #000',
              fontWeight: 700,
              fontSize: 12,
            }}>
              {percentage}%
            </div>
          )}
        </div>
        <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 15, color: '#000' }}>
          {quiz.title || 'Untitled Quiz'}
        </Text>
        <Space size={16}>
          <Text style={{ color: '#666', fontSize: 13 }}>{quiz.total_questions} questions</Text>
          {quiz.score !== null && (
            <Text style={{ color: '#666', fontSize: 13 }}>
              {quiz.score}/{quiz.total_questions} correct
            </Text>
          )}
          <Text style={{ color: '#666', fontSize: 13 }}>{quiz.articles?.length || 0} articles</Text>
        </Space>
      </Card>
    </Link>
  )
}
