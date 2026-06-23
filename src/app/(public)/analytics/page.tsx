import Link from 'next/link';
import dayjs from 'dayjs';
import { serverFetch } from '@/lib/server-fetch';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

function AnalyticsSkeleton() {
  return (
    <div>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 6, display: 'block' }}>
        Analytics
      </span>
      <div
        className="newspaper-heading"
        style={{
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: '-0.3px',
          color: 'var(--color-text)',
          lineHeight: 1.15,
          marginBottom: 20,
        }}
      >
        Your Performance
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              background: 'var(--color-surface)',
              borderRadius: 12,
              padding: 18,
              textAlign: 'center',
              border: '1px solid var(--color-border)',
            }}
          >
            <div
              style={{
                width: '60%',
                height: 10,
                background: 'var(--color-border)',
                margin: '0 auto 8px',
                borderRadius: 2,
              }}
            />
            <div
              style={{
                width: '40%',
                height: 24,
                background: 'var(--color-border)',
                margin: '0 auto',
                borderRadius: 2,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const getColor = (acc: number) => {
  if (acc >= 70) return '#22c55e';
  if (acc >= 50) return '#eab308';
  return '#ef4444';
};

async function AnalyticsContent() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/analytics');

  const [stats, historyData] = await Promise.all([
    serverFetch<any>('/analytics/performance').catch(() => null),
    serverFetch<any[]>('/history').catch(() => [] as any[]),
  ]);

  const history = Array.isArray(historyData) ? historyData : (historyData as any)?.quizzes || [];

  if (!stats && history.length === 0) {
    return (
      <div>
        <div
          className="newspaper-heading"
          style={{
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: '-0.3px',
            color: 'var(--color-text)',
            lineHeight: 1.15,
            marginBottom: 20,
          }}
        >
          Your Performance
        </div>
        <Link href="/quiz">
          <span
            style={{
              fontWeight: 600,
              borderRadius: 8,
              height: 38,
              padding: '0 24px',
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--color-primary)',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Take your first quiz
          </span>
        </Link>
      </div>
    );
  }

  const statCards = [
    { label: 'Quizzes Taken', value: stats?.total_quizzes || 0, color: 'var(--color-text)' },
    {
      label: 'Overall Accuracy',
      value: `${stats?.overall_accuracy || 0}%`,
      color: getColor(stats?.overall_accuracy || 0),
    },
    { label: 'Questions', value: stats?.total_questions || 0, color: 'var(--color-text)' },
    { label: 'Correct', value: stats?.total_correct || 0, color: '#22c55e' },
  ];

  return (
    <div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
          marginBottom: 6,
          display: 'block',
        }}
      >
        Analytics
      </span>
      <div
        className="newspaper-heading"
        style={{
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: '-0.3px',
          color: 'var(--color-text)',
          lineHeight: 1.15,
          marginBottom: 20,
        }}
      >
        Your Performance
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 12,
          marginBottom: 28,
        }}
      >
        {statCards.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'var(--color-surface)',
              borderRadius: 12,
              padding: 18,
              textAlign: 'center',
              border: '1px solid var(--color-border)',
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--color-text-tertiary)',
                display: 'block',
                marginBottom: 6,
              }}
            >
              {stat.label}
            </span>
            <div
              style={{
                fontWeight: 700,
                fontSize: 22,
                color: stat.color,
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {stats?.topics && stats.topics.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-text)',
              display: 'block',
              marginBottom: 12,
            }}
          >
            Topic Breakdown
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats.topics.map((topic: any) => {
              const pct = topic.accuracy;
              return (
                <div
                  key={topic.topic}
                  style={{
                    background: 'var(--color-surface)',
                    borderRadius: 10,
                    padding: 14,
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>
                      {topic.topic}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', fontWeight: 600 }}>
                      {topic.correct}/{topic.total} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: getColor(pct),
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-text)',
              display: 'block',
              marginBottom: 12,
            }}
          >
            Recent Quizzes
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.slice(0, 5).map((quiz: any) => {
              const pct = quiz.total_questions ? Math.round(((quiz.score || 0) / quiz.total_questions) * 100) : 0;
              return (
                <div
                  key={quiz.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--color-surface)',
                    borderRadius: 10,
                    padding: 14,
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
                      {pct}% Score
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2, display: 'block' }}>
                      {quiz.score || 0}/{quiz.total_questions} questions
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 16, color: getColor(pct), fontWeight: 700 }}>{pct}%</span>
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--color-text-tertiary)',
                        display: 'block',
                        marginTop: 2,
                      }}
                    >
                      {quiz.created_at ? dayjs(quiz.created_at).format('DD-MM-YYYY') : '-'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsContent />
    </Suspense>
  );
}
