'use client';

import { useEffect, useState } from 'react';
import { Typography, Spin, Button } from 'antd';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { Quiz } from '@/lib/types';
import HistoryCard from '@/components/HistoryCard';

const { Text } = Typography;

export default function HistoryPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = useAuthStore((s) => s.accessToken);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .getHistory()
      .then((data) => setQuizzes(Array.isArray(data) ? data : data.quizzes || []))
      .catch(() => setError('Failed to load history'))
      .finally(() => setLoading(false));
  }, [token]);

  const avgScore =
    quizzes.length > 0 ? Math.round(quizzes.reduce((sum, q) => sum + (q.score || 0), 0) / quizzes.length) : 0;

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#22c55e';
    if (score >= 50) return '#eab308';
    return '#ef4444';
  };

  return (
    <div>
      <Text
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
        Quiz History
      </Text>
      <div
        className="newspaper-heading"
        style={{
          fontWeight: 800,
          fontSize: isMobile ? 20 : 26,
          letterSpacing: '-0.3px',
          color: 'var(--color-text)',
          lineHeight: 1.15,
          marginBottom: isMobile ? 16 : 24,
        }}
      >
        Archives
      </div>

      {quizzes.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: isMobile ? 20 : 28,
          }}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 10,
              padding: isMobile ? '12px 16px' : '14px 20px',
              border: '1px solid var(--color-border)',
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--color-text-tertiary)',
                display: 'block',
                marginBottom: 4,
              }}
            >
              Total Quizzes
            </Text>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-text)' }}>{quizzes.length}</div>
          </div>
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 10,
              padding: isMobile ? '12px 16px' : '14px 20px',
              border: '1px solid var(--color-border)',
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--color-text-tertiary)',
                display: 'block',
                marginBottom: 4,
              }}
            >
              Avg Score
            </Text>
            <div style={{ fontWeight: 700, fontSize: 18, color: getScoreColor(avgScore) }}>{avgScore}%</div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : !token ? (
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 12,
            padding: isMobile ? '32px 20px' : '48px 32px',
            textAlign: 'center',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            className="newspaper-heading"
            style={{
              fontSize: isMobile ? 16 : 20,
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: 6,
            }}
          >
            Please login to view your quiz history
          </div>
          <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 13, display: 'block', marginBottom: 20 }}>
            Track your progress and improve your scores
          </Text>
          <Link href="/login">
            <Button
              type="primary"
              size="middle"
              style={{ fontWeight: 600, borderRadius: 8, height: 38, padding: '0 24px', fontSize: 13 }}
            >
              Login
            </Button>
          </Link>
        </div>
      ) : error ? (
        <div
          style={{
            padding: '6px 10px',
            border: '1px solid #ef4444',
            color: '#ef4444',
            fontSize: 12,
            display: 'inline-block',
          }}
        >
          {error}
        </div>
      ) : quizzes.length === 0 ? (
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 12,
            padding: isMobile ? '32px 20px' : '48px 32px',
            textAlign: 'center',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            className="newspaper-heading"
            style={{
              fontSize: isMobile ? 16 : 20,
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: 6,
            }}
          >
            No quizzes attempted yet
          </div>
          <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 13, display: 'block', marginBottom: 20 }}>
            Start your first quiz to track your progress
          </Text>
          <Link href="/quiz">
            <Button
              type="primary"
              size="middle"
              style={{ fontWeight: 600, borderRadius: 8, height: 38, padding: '0 24px', fontSize: 13 }}
            >
              Take your first quiz
            </Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-text-tertiary)',
              marginBottom: 2,
            }}
          >
            {quizzes.length} Quiz{quizzes.length !== 1 ? 'zes' : ''}
          </Text>
          {quizzes.map((quiz) => (
            <HistoryCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
