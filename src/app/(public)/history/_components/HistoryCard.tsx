import Link from 'next/link';
import dayjs from 'dayjs';
import type { Quiz } from '@/lib/types';

export default function HistoryCard({ quiz }: { quiz: Quiz }) {
  const percentage = quiz.score !== null ? Math.round((quiz.score / quiz.total_questions) * 100) : null;

  const color =
    quiz.score !== null ? (percentage! >= 60 ? '#22c55e' : percentage! >= 30 ? '#eab308' : '#ef4444') : '#6b6b6b';

  return (
    <Link href={`/history/${quiz.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        className="history-card"
        style={{
          padding: '14px 16px',
          background: 'var(--color-surface)',
          borderRadius: 10,
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          cursor: 'pointer',
          transition: 'border-color 0.15s',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="newspaper-heading" style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
            {quiz.title || 'Quiz'}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              style={{
                color: 'var(--color-text-tertiary)',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {dayjs(quiz.created_at).format('DD-MM-YYYY')}
            </span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: 'var(--color-text-tertiary)',
                display: 'inline-block',
              }}
            />
            <span style={{ color: 'var(--color-text-tertiary)', fontSize: 11 }}>{quiz.total_questions} questions</span>
            {quiz.articles?.length ? (
              <>
                <span
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: '50%',
                    background: 'var(--color-text-tertiary)',
                    display: 'inline-block',
                  }}
                />
                <span style={{ color: 'var(--color-text-tertiary)', fontSize: 11 }}>
                  {quiz.articles.length} articles
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {percentage !== null && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 6,
                margin: 0,
                padding: '1px 8px',
                color,
                border: `1px solid ${color}`,
                background: `${color}15`,
              }}
            >
              {percentage}%
            </span>
          )}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
    </Link>
  );
}
