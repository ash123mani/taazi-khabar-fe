import type { Metadata } from 'next';
import { Suspense } from 'react';
import { serverFetch } from '@/lib/server-fetch';
import QuizContent from './_components/QuizContent';

export const metadata: Metadata = {
  title: 'Daily Quiz',
  description:
    'Test your UPSC current affairs knowledge with daily quizzes powered by AI. Multiple-choice questions based on today\'s news from top sources.',
  openGraph: {
    title: 'Daily Quiz | Taazi Khabar',
    description:
      'Test your UPSC current affairs knowledge with daily quizzes powered by AI.',
    type: 'website',
  },
};

function SkeletonCard({ h }: { h?: number }) {
  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)' }}>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ width: '50%', height: 8, background: 'var(--color-border)', borderRadius: 2, marginBottom: 8 }} />
        <div style={{ width: '70%', height: h || 18, background: 'var(--color-border)', borderRadius: 2 }} />
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 12, padding: '16px 12px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
      <div style={{ width: 32, height: 24, background: 'var(--color-border)', borderRadius: 2, margin: '0 auto 6px' }} />
      <div style={{ width: '50%', height: 8, background: 'var(--color-border)', borderRadius: 2, margin: '0 auto' }} />
    </div>
  );
}

function QuizSkeleton() {
  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <div
            className="newspaper-heading"
            style={{ fontWeight: 800, fontSize: 26, letterSpacing: '-0.3px', color: 'var(--color-text)', lineHeight: 1.15 }}
          >
            Quiz
          </div>
          <div style={{ width: 100, height: 24, background: 'var(--color-border)', borderRadius: 2 }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[1, 2, 3, 4].map(i => <StatSkeleton key={i} />)}
      </div>
      <div style={{ width: 120, height: 10, background: 'var(--color-border)', borderRadius: 2, marginBottom: 12 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} h={40} />)}
      </div>
    </div>
  );
}

async function QuizContentFetcher({ date }: { date: string }) {
  const summary = await serverFetch<any>(`/quizzes/by-date${date ? `?date_str=${date}` : ''}`).catch(() => null);
  return <QuizContent key={date} date={date} initialSummary={summary} />;
}

export default function QuizPage({
  searchParams,
}: {
  searchParams?: { date?: string };
}) {
  const date = searchParams?.date || new Date().toISOString().slice(0, 10);

  return (
    <Suspense fallback={<QuizSkeleton />}>
      <QuizContentFetcher date={date} />
    </Suspense>
  );
}
