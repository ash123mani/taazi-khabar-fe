'use client'

import { Card, Typography, Tag, Space } from 'antd'
import Link from 'next/link'
import { RightOutlined } from '@ant-design/icons'
import type { Quiz } from '@/lib/types'

const { Text } = Typography

export default function HistoryCard({ quiz }: { quiz: Quiz }) {
  const percentage = quiz.score !== null
    ? Math.round((quiz.score / quiz.total_questions) * 100)
    : null

  const color = quiz.score !== null
    ? percentage! >= 60 ? '#2e7d32' : percentage! >= 30 ? '#e65100' : '#c62828'
    : '#9e9e9e'

  return (
    <Link href={`/history/${quiz.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <Card
        className="article-card fade-in"
        hoverable
        styles={{ body: { padding: '14px 18px' } }}
        style={{ marginBottom: 8 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text strong style={{ fontSize: 14, display: 'block', color: '#1a1a1a' }}>
              {quiz.title || 'Quiz'}
            </Text>
            <Space size={12} style={{ marginTop: 4 }}>
              <Text style={{ color: '#9e9e9e', fontSize: 12 }}>
                {new Date(quiz.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </Text>
              <Text style={{ color: '#9e9e9e', fontSize: 12 }}>
                {quiz.total_questions} questions
              </Text>
              {quiz.articles?.length ? (
                <Text style={{ color: '#9e9e9e', fontSize: 12 }}>
                  {quiz.articles.length} articles
                </Text>
              ) : null}
            </Space>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {percentage !== null && (
              <Tag style={{
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 6,
                margin: 0,
                padding: '2px 10px',
                color,
                border: `1px solid ${color}`,
                background: `${color}0a`,
              }}>
                {percentage}%
              </Tag>
            )}
            <RightOutlined style={{ color: '#ccc', fontSize: 12 }} />
          </div>
        </div>
      </Card>
    </Link>
  )
}
