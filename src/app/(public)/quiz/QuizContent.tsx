'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Button, Spin, DatePicker, Tag, Empty, Modal, List, Avatar } from 'antd';
import {
  CalendarOutlined,
  ThunderboltOutlined,
  BookOutlined,
  FileTextOutlined,
  EyeOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDailyQuizSummary, useStartDailyQuiz } from '@/hooks/useQuizzes';
import { useAuthStore } from '@/stores/authStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { DailyQuizCategory } from '@/lib/types';

const { Text } = Typography;

export default function QuizContent() {
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken);
  const isMobile = useIsMobile();

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(today);
  const [error, setError] = useState('');
  const [modalCat, setModalCat] = useState<DailyQuizCategory | null>(null);

  const { data: summary, isLoading } = useDailyQuizSummary(date);
  const startQuiz = useStartDailyQuiz();

  const handleStartQuiz = async (category_id?: string) => {
    if (!token) {
      router.push('/login?callbackUrl=/quiz');
      return;
    }
    setError('');
    try {
      const result = await startQuiz.mutateAsync({ date, category_id });
      router.push(`/quiz/${result.quiz_id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to start quiz');
    }
  };

  const catColors: Record<string, string> = {
    Polity: '#6366f1',
    Economy: '#22c55e',
    'International Relations': '#3b82f6',
    'Science & Tech': '#a855f7',
    Environment: '#14b8a6',
    Geography: '#f59e0b',
    History: '#ef4444',
    Security: '#ec4899',
    'Social Issues': '#f97316',
  };

  return (
    <div>
      {/* Masthead */}
      <div
        style={{
          borderBottom: '1px solid var(--color-border-light)',
          paddingBottom: isMobile ? 8 : 12,
          marginBottom: isMobile ? 10 : 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <div
            className="newspaper-heading"
            style={{
              fontWeight: 800,
              fontSize: isMobile ? 20 : 26,
              letterSpacing: '-0.3px',
              color: 'var(--color-text)',
              lineHeight: 1.15,
            }}
          >
            Quiz — {dayjs(date).format('D MMMM YYYY')}
          </div>
          <DatePicker
            value={dayjs(date)}
            onChange={(d) => {
              if (d) {
                setDate(d.format('YYYY-MM-DD'));
                setError('');
              }
            }}
            allowClear={false}
            format="DD-MM-YYYY"
            disabledDate={(current) => {
              if (!current) return false;
              return current.isBefore(dayjs('2026-06-07')) || current.isAfter(dayjs());
            }}
            suffixIcon={
              <CalendarOutlined style={{ fontSize: isMobile ? 10 : 12, color: 'var(--color-text-tertiary)' }} />
            }
            size="small"
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 2,
              fontSize: 11,
            }}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: '6px 10px',
            border: '1px solid #ef4444',
            marginBottom: 12,
            fontSize: 12,
            color: '#ef4444',
            display: 'inline-block',
          }}
        >
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : !summary || summary.categories.length === 0 ? (
        <div style={{ padding: isMobile ? '32px 12px' : '48px 16px', textAlign: 'center' }}>
          <Empty
            description={
              <div>
                <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 13, display: 'block', marginBottom: 4 }}>
                  No quizzes available for {dayjs(date).format('DD-MM-YYYY')}
                </Text>
                <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 11 }}>
                  Articles need to be scraped and summarized first
                </Text>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(3, 1fr) 1fr' : 'repeat(4, 1fr)',
              gap: 10,
              marginBottom: isMobile ? 14 : 20,
            }}
          >
            {[
              { label: 'Articles', value: summary.total_articles },
              { label: 'Questions', value: summary.total_questions },
              { label: 'Categories', value: summary.categories.length },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 12,
                  padding: isMobile ? '12px 6px' : '16px 12px',
                  textAlign: 'center',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: isMobile ? 22 : 26,
                    color: 'var(--color-text)',
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {stat.value}
                </div>
                <Text
                  style={{
                    color: 'var(--color-text-tertiary)',
                    fontSize: isMobile ? 9 : 10,
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                  }}
                >
                  {stat.label}
                </Text>
              </div>
            ))}
            <div
              onClick={() => handleStartQuiz()}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: 12,
                padding: isMobile ? '12px 6px' : '16px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ThunderboltOutlined style={{ fontSize: isMobile ? 22 : 26, color: '#fff' }} />
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: isMobile ? 9 : 10,
                  marginTop: 4,
                  letterSpacing: '0.5px',
                }}
              >
                Take All
              </Text>
            </div>
          </div>

          {/* Category grid */}
          <Text
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--color-text-tertiary)',
              marginBottom: 10,
              display: 'block',
            }}
          >
            Category-wise Quiz
          </Text>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 12 }}>
            {summary.categories.map((cat: DailyQuizCategory) => (
              <div
                key={cat.id}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 12,
                  padding: isMobile ? 14 : 18,
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: isMobile ? 32 : 38,
                      height: isMobile ? 32 : 38,
                      borderRadius: 8,
                      background: catColors[cat.name] || '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <BookOutlined style={{ fontSize: isMobile ? 14 : 17, color: '#fff' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: isMobile ? 14 : 16,
                        color: 'var(--color-text)',
                        lineHeight: 1.2,
                      }}
                    >
                      {cat.name}
                    </div>
                    <Text
                      style={{
                        color: 'var(--color-text-tertiary)',
                        fontSize: isMobile ? 10 : 11,
                        marginTop: 1,
                        display: 'block',
                      }}
                    >
                      {cat.article_count} article{cat.article_count !== 1 ? 's' : ''} &middot; {cat.question_count}{' '}
                      question{cat.question_count !== 1 ? 's' : ''}
                    </Text>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <Button
                    type="default"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => setModalCat(cat)}
                    style={{
                      borderRadius: 8,
                      fontSize: 11,
                      height: 30,
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-tertiary)',
                      background: 'transparent',
                    }}
                  >
                    Articles
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    icon={<ThunderboltOutlined />}
                    onClick={() => handleStartQuiz(cat.id)}
                    style={{ borderRadius: 8, fontSize: 11, height: 30 }}
                  >
                    Start Quiz
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Articles modal */}
      <Modal
        title={<span>{modalCat?.name} — Articles</span>}
        open={!!modalCat}
        onCancel={() => setModalCat(null)}
        footer={null}
        width={640}
        styles={{ body: { padding: '8px 0', maxHeight: 480, overflowY: 'auto' } }}
      >
        {modalCat && (
          <List
            dataSource={modalCat.articles}
            renderItem={(article) => (
              <List.Item
                style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)' }}
                onClick={() => window.open(article.url, '_blank')}
              >
                <List.Item.Meta
                  avatar={
                    article.image_url ? (
                      <Avatar shape="square" size={44} src={article.image_url} style={{ borderRadius: 2 }} />
                    ) : (
                      <Avatar
                        shape="square"
                        size={44}
                        icon={<FileTextOutlined />}
                        style={{ borderRadius: 2, background: 'var(--color-surface)', color: '#6366f1' }}
                      />
                    )
                  }
                  title={
                    <Text style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>
                      {article.headline}
                    </Text>
                  }
                  description={
                    <Tag style={{ borderRadius: 0, margin: 0, fontSize: 9 }}>
                      {article.source === 'thehindu'
                        ? 'The Hindu'
                        : article.source === 'indianexpress'
                          ? 'Indian Express'
                          : 'PIB'}
                    </Tag>
                  }
                />
                <LinkOutlined style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }} />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
}
