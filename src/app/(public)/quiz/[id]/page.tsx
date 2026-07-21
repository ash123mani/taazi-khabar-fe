import type { Metadata } from 'next';
import { serverFetch } from '@/lib/server-fetch';
import { Suspense } from 'react';
import TakeQuizClient from './_components/TakeQuizClient';
import type { Quiz } from '@/lib/types';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const quiz = await serverFetch<Quiz>(`/quizzes/${params.id}`);
    return {
      title: quiz.title || 'Take Quiz',
      description: `Take the "${quiz.title || 'quiz'}" on Taazi Khabar and test your UPSC current affairs knowledge.`,
      openGraph: {
        title: `${quiz.title || 'Quiz'} | Taazi Khabar`,
        description: `Take the "${quiz.title || 'quiz'}" and test your UPSC current affairs knowledge.`,
        type: 'website',
      },
    };
  } catch {
    return { title: 'Take Quiz' };
  }
}

function TakeQuizSkeleton() {
  return (
    <div>
      <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 80, height: 28, background: 'var(--color-border)', borderRadius: 8 }} />
            <div style={{ width: 60, height: 28, background: 'var(--color-border)', borderRadius: 8 }} />
          </div>
          <div style={{ width: 120, height: 16, background: 'var(--color-border)', borderRadius: 2 }} />
        </div>
        <div style={{ marginTop: 16, height: 4, background: 'var(--color-border)', borderRadius: 2 }} />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--color-border)', flexShrink: 0 }} />
            <div style={{ width: 60, height: 10, background: 'var(--color-border)', borderRadius: 2 }} />
          </div>
          <div style={{ background: 'var(--color-surface)', borderRadius: 12, padding: 20, border: '1px solid var(--color-border)' }}>
            <div style={{ width: '90%', height: 14, background: 'var(--color-border)', borderRadius: 2, marginBottom: 16 }} />
            <div style={{ width: '60%', height: 14, background: 'var(--color-border)', borderRadius: 2, marginBottom: 24 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3, 4].map((j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid var(--color-border)', flexShrink: 0 }} />
                  <div style={{ flex: 1, height: 10, background: 'var(--color-border)', borderRadius: 2 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <div style={{ width: 200, height: 48, background: 'var(--color-border)', borderRadius: 10, margin: '0 auto' }} />
      </div>
    </div>
  );
}

async function TakeQuizFetcher({ id }: { id: string }) {
  let quiz: Quiz | null = null;
  let error = '';

  try {
    quiz = await serverFetch<Quiz>(`/quizzes/${id}`);
  } catch (e: any) {
    error = e.message || 'Failed to load quiz';
  }

  return <TakeQuizClient id={id} initialQuiz={quiz} initialError={error} />;
}

export default function TakeQuizPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<TakeQuizSkeleton />}>
      <TakeQuizFetcher id={params.id} />
    </Suspense>
  );
}
