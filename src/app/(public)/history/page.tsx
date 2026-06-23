import Link from 'next/link';
import { serverFetch } from '@/lib/server-fetch';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import HistoryCard from './_components/HistoryCard';
import type { Quiz } from '@/lib/types';

function getScoreColor(score: number) {
  if (score >= 70) return '#22c55e';
  if (score >= 50) return '#eab308';
  return '#ef4444';
}

function HistorySkeleton() {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 6 }}>
        Quiz History
      </div>
      <div className="newspaper-heading" style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.3px', color: 'var(--color-text)', lineHeight: 1.15, marginBottom: 24 }}>
        Archives
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[1, 2].map(i => (
          <div key={i} style={{ background: 'var(--color-surface)', borderRadius: 10, padding: 14, border: '1px solid var(--color-border)', flex: 1 }}>
            <div style={{ width: '50%', height: 8, background: 'var(--color-border)', borderRadius: 2, marginBottom: 8 }} />
            <div style={{ width: '30%', height: 18, background: 'var(--color-border)', borderRadius: 2 }} />
          </div>
        ))}
      </div>
      <div style={{ width: 100, height: 10, background: 'var(--color-border)', borderRadius: 2, marginBottom: 12 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ background: 'var(--color-surface)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ width: '60%', height: 14, background: 'var(--color-border)', borderRadius: 2, marginBottom: 6 }} />
              <div style={{ width: '40%', height: 10, background: 'var(--color-border)', borderRadius: 2 }} />
            </div>
            <div style={{ width: 40, height: 20, background: 'var(--color-border)', borderRadius: 6 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

async function HistoryContent() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/history');

  const data = await serverFetch<any>('/history').catch(() => null);
  const quizzes: Quiz[] = data ? (Array.isArray(data) ? data : data.quizzes || []) : [];

  const avgScore = quizzes.length > 0
    ? Math.round(quizzes.reduce((sum, q) => sum + (q.score || 0), 0) / quizzes.length)
    : 0;

  return (
    <div>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 6, display: 'block' }}>
        Quiz History
      </span>
      <div className="newspaper-heading" style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.3px', color: 'var(--color-text)', lineHeight: 1.15, marginBottom: 24 }}>
        Archives
      </div>

      {quizzes.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 10, padding: 14, border: '1px solid var(--color-border)', flex: 1 }}>
            <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: 4 }}>
              Total Quizzes
            </span>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-text)' }}>{quizzes.length}</div>
          </div>
          <div style={{ background: 'var(--color-surface)', borderRadius: 10, padding: 14, border: '1px solid var(--color-border)', flex: 1 }}>
            <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: 4 }}>
              Avg Score
            </span>
            <div style={{ fontWeight: 700, fontSize: 18, color: getScoreColor(avgScore) }}>{avgScore}%</div>
          </div>
        </div>
      )}

      {quizzes.length === 0 ? (
        <div style={{ background: 'var(--color-surface)', borderRadius: 12, padding: '32px 20px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
          <div className="newspaper-heading" style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            No quizzes attempted yet
          </div>
          <span style={{ color: 'var(--color-text-tertiary)', fontSize: 13, display: 'block', marginBottom: 20 }}>
            Start your first quiz to track your progress
          </span>
          <Link href="/quiz">
            <span style={{ fontWeight: 600, borderRadius: 8, height: 38, padding: '0 24px', fontSize: 13, display: 'inline-flex', alignItems: 'center', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer' }}>
              Take your first quiz
            </span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 2 }}>
            {quizzes.length} Quiz{quizzes.length !== 1 ? 'zes' : ''}
          </span>
          {quizzes.map((quiz) => (
            <HistoryCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<HistorySkeleton />}>
      <HistoryContent />
    </Suspense>
  );
}
