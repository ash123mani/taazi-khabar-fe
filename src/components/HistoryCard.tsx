'use client'

import { Typography, Tag } from 'antd'
import Link from 'next/link'
import { RightOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Quiz } from '@/lib/types'

const { Text } = Typography

export default function HistoryCard({ quiz }: { quiz: Quiz }) {
  const isMobile = useIsMobile()
  const percentage = quiz.score !== null
    ? Math.round((quiz.score / quiz.total_questions) * 100)
    : null

  const color = quiz.score !== null
    ? percentage! >= 60 ? '#22c55e' : percentage! >= 30 ? '#eab308' : '#ef4444'
    : '#6b6b6b'

  return (
    <Link href={`/history/${quiz.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        padding: isMobile ? '14px 16px' : '14px 18px',
        background: 'var(--color-surface)',
        borderRadius: 10,
        border: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-tertiary)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="newspaper-heading" style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
            {quiz.title || 'Quiz'}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
            <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {dayjs(quiz.created_at).format('DD-MM-YYYY')}
            </Text>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--color-text-tertiary)', display: 'inline-block' }} />
            <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 11 }}>
              {quiz.total_questions} questions
            </Text>
            {quiz.articles?.length ? (
              <>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--color-text-tertiary)', display: 'inline-block' }} />
                <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 11 }}>
                  {quiz.articles.length} articles
                </Text>
              </>
            ) : null}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {percentage !== null && (
            <Tag style={{
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 6,
              margin: 0,
              padding: '1px 8px',
              color,
              border: `1px solid ${color}`,
              background: `${color}15`,
            }}>
              {percentage}%
            </Tag>
          )}
          <RightOutlined style={{ color: 'var(--color-text-tertiary)', fontSize: 11 }} />
        </div>
      </div>
    </Link>
  )
}
