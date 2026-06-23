'use client';

import { Button, Typography } from 'antd';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { Quiz } from '@/lib/types';

const { Text } = Typography;

export default function QuizResult({ quiz }: { quiz: Quiz }) {
  const isMobile = useIsMobile();
  const percentage = Math.round(((quiz.score || 0) / quiz.total_questions) * 100);

  const getColor = () => {
    if (percentage >= 80) return '#22c55e';
    if (percentage >= 50) return '#eab308';
    return '#ef4444';
  };

  const getLabel = () => {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 50) return 'Good Effort';
    return 'Keep Practicing';
  };

  return (
    <div
      style={{
        marginBottom: 28,
        textAlign: 'center',
        padding: isMobile ? 24 : 36,
        background: 'var(--color-surface)',
        borderRadius: 12,
        border: '1px solid var(--color-border)',
      }}
    >
      <div
        className="newspaper-heading"
        style={{
          fontSize: 64,
          fontWeight: 800,
          marginBottom: 2,
          color: getColor(),
          lineHeight: 1,
          letterSpacing: '-2px',
        }}
      >
        {percentage}%
      </div>
      <Text style={{ fontSize: 18, fontWeight: 600, color: getColor(), display: 'block', marginBottom: 12 }}>
        {getLabel()}
      </Text>
      <div style={{ fontSize: 14, marginBottom: 6, color: 'var(--color-text-tertiary)' }}>
        {quiz.score} / {quiz.total_questions} correct
      </div>
      {quiz.time_taken_sec && (
        <div style={{ fontSize: 13, marginBottom: 24, color: 'var(--color-text-tertiary)' }}>
          Time taken: {Math.floor(quiz.time_taken_sec / 60)}m {quiz.time_taken_sec % 60}s
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          marginTop: quiz.time_taken_sec ? 12 : 24,
        }}
      >
        <Link href={`/history/${quiz.id}`}>
          <Button
            type="default"
            style={{
              height: 40,
              padding: '0 24px',
              fontWeight: 600,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'transparent',
            }}
          >
            Review Answers
          </Button>
        </Link>
        <Link href="/quiz">
          <Button
            type="primary"
            style={{ height: 40, padding: '0 24px', fontWeight: 600, borderRadius: 8, border: 'none' }}
          >
            New Quiz
          </Button>
        </Link>
      </div>
    </div>
  );
}
