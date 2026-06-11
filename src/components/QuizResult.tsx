'use client'

import { Button, Typography, Card } from 'antd'
import Link from 'next/link'
import type { Quiz } from '@/lib/types'

const { Text } = Typography

export default function QuizResult({ quiz }: { quiz: Quiz }) {
  const percentage = Math.round(((quiz.score || 0) / quiz.total_questions) * 100)

  const getColor = () => {
    if (percentage >= 80) return '#22c55e'
    if (percentage >= 50) return '#eab308'
    return '#ef4444'
  }

  const getLabel = () => {
    if (percentage >= 80) return 'Excellent!'
    if (percentage >= 50) return 'Good Effort'
    return 'Keep Practicing'
  }

  return (
    <Card style={{ borderRadius: 12, marginBottom: 28, textAlign: 'center', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: 32 } }}>
      <div style={{
        fontSize: 64,
        fontWeight: 800,
        marginBottom: 2,
        color: getColor(),
        lineHeight: 1,
        letterSpacing: '-2px',
      }}>
        {percentage}%
      </div>
      <Text style={{ fontSize: 18, fontWeight: 600, color: getColor(), display: 'block', marginBottom: 12 }}>
        {getLabel()}
      </Text>
      <div style={{ fontSize: 14, marginBottom: 6, color: 'var(--color-text-tertiary)' }}>
        {quiz.score} / {quiz.total_questions} correct
      </div>
      {quiz.time_taken_sec && (
        <div style={{ fontSize: 13, marginBottom: 24, color: '#4a4a4a' }}>
          Time taken: {Math.floor(quiz.time_taken_sec / 60)}m {quiz.time_taken_sec % 60}s
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
        marginTop: quiz.time_taken_sec ? 0 : 24,
      }}>
        <Link href={`/history/${quiz.id}`}>
          <Button type="default" style={{ height: 40, padding: '0 24px', fontWeight: 600, borderRadius: 8 }}>
            Review Answers
          </Button>
        </Link>
        <Link href="/quiz">
          <Button type="primary" style={{ height: 40, padding: '0 24px', fontWeight: 600, borderRadius: 8 }}>
            New Quiz
          </Button>
        </Link>
      </div>
    </Card>
  )
}
