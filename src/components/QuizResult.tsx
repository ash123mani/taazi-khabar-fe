'use client'

import { Button } from 'antd'
import Link from 'next/link'
import type { Quiz } from '@/lib/types'

export default function QuizResult({ quiz }: { quiz: Quiz }) {
  const percentage = Math.round(((quiz.score || 0) / quiz.total_questions) * 100)

  return (
    <div style={{
      border: '3px solid #000',
      padding: 40,
      textAlign: 'center',
      background: '#fff',
      marginBottom: 32,
    }}>
      <div style={{ fontSize: 64, fontWeight: 800, marginBottom: 8 }}>
        {percentage}%
      </div>
      <div style={{ fontSize: 18, color: '#666', marginBottom: 4 }}>
        {quiz.score} / {quiz.total_questions} correct
      </div>
      {quiz.time_taken_sec && (
        <div style={{ fontSize: 14, color: '#999', marginBottom: 24 }}>
          Time taken: {Math.floor(quiz.time_taken_sec / 60)}m {quiz.time_taken_sec % 60}s
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link href={`/history/${quiz.id}`}>
          <Button style={{ border: '2px solid #000', borderRadius: 0, height: 44, padding: '0 24px', fontWeight: 600 }}>
            View Details
          </Button>
        </Link>
        <Link href="/quiz">
          <Button type="primary" style={{ borderRadius: 0, height: 44, padding: '0 24px', fontWeight: 600 }}>
            New Quiz
          </Button>
        </Link>
      </div>
    </div>
  )
}
