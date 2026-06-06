'use client'

import { Button } from 'antd'
import Link from 'next/link'
import type { Quiz } from '@/lib/types'

export default function QuizResult({ quiz }: { quiz: Quiz }) {
  const percentage = Math.round(((quiz.score || 0) / quiz.total_questions) * 100)

  return (
    <div className="article-card fade-in" style={{
      padding: 40,
      textAlign: 'center',
      marginBottom: 32,
    }}>
      <div style={{
        fontSize: 72,
        fontWeight: 800,
        marginBottom: 4,
        color: percentage >= 60 ? '#2e7d32' : percentage >= 30 ? '#e65100' : '#c62828',
        lineHeight: 1,
      }}>
        {percentage}%
      </div>
      <div style={{ fontSize: 16, marginBottom: 6, color: '#616161' }}>
        {quiz.score} / {quiz.total_questions} correct
      </div>
      {quiz.time_taken_sec && (
        <div style={{ fontSize: 14, marginBottom: 28, color: '#9e9e9e' }}>
          Time taken: {Math.floor(quiz.time_taken_sec / 60)}m {quiz.time_taken_sec % 60}s
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link href={`/history/${quiz.id}`}>
          <Button style={{ height: 44, padding: '0 28px', fontWeight: 600 }}>
            View Details
          </Button>
        </Link>
        <Link href="/quiz">
          <Button type="primary" style={{ height: 44, padding: '0 28px', fontWeight: 600 }}>
            New Quiz
          </Button>
        </Link>
      </div>
    </div>
  )
}
