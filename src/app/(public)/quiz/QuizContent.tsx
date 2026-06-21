'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Typography, Button, Spin, DatePicker, Tag, Empty, Modal, List, Avatar } from 'antd'
import { CalendarOutlined, ThunderboltOutlined, BookOutlined, FileTextOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useDailyQuizSummary, useStartDailyQuiz } from '@/hooks/useQuizzes'
import { useAuthStore } from '@/stores/authStore'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { DailyQuizCategory } from '@/lib/types'

const { Text } = Typography

export default function QuizContent() {
  const router = useRouter()
  const token = useAuthStore((s) => s.accessToken)
  const isMobile = useIsMobile()

  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState<string>(today)
  const [error, setError] = useState('')
  const [modalCat, setModalCat] = useState<DailyQuizCategory | null>(null)

  const { data: summary, isLoading } = useDailyQuizSummary(date)
  const startQuiz = useStartDailyQuiz()

  const handleStartQuiz = async (category_id?: string) => {
    if (!token) { router.push('/login?callbackUrl=/quiz'); return }
    setError('')
    try {
      const result = await startQuiz.mutateAsync({ date, category_id })
      router.push(`/quiz/${result.quiz_id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to start quiz')
    }
  }

  const catColors: Record<string, string> = {
    Polity: '#6366f1', Economy: '#22c55e', 'International Relations': '#3b82f6',
    'Science & Tech': '#a855f7', Environment: '#14b8a6', Geography: '#f59e0b',
    History: '#ef4444', Security: '#ec4899', 'Social Issues': '#f97316',
  }

  return (
    <div>
      {/* Masthead */}
      <div style={{
        borderBottom: '1px solid var(--color-border-light)',
        paddingBottom: isMobile ? 8 : 12,
        marginBottom: isMobile ? 10 : 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <div className="newspaper-heading" style={{
            fontWeight: 800,
            fontSize: isMobile ? 20 : 26,
            letterSpacing: '-0.3px',
            color: 'var(--color-text)',
            lineHeight: 1.15,
          }}>
            Daily Quiz
          </div>
          <DatePicker
            value={dayjs(date)}
            onChange={(d) => { if (d) { setDate(d.format('YYYY-MM-DD')); setError('') } }}
            allowClear={false}
            format="DD-MM-YYYY"
            suffixIcon={<CalendarOutlined style={{ fontSize: isMobile ? 10 : 12, color: 'var(--color-text-tertiary)' }} />}
            size="small"
            style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 2, fontSize: 11 }}
          />
        </div>
      </div>

      {error && (
        <div style={{ padding: '6px 10px', border: '1px solid #ef4444', marginBottom: 12, fontSize: 12, color: '#ef4444', display: 'inline-block' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr) 1fr' : 'repeat(4, 1fr)',
            borderBottom: '1px solid var(--color-border-light)',
            marginBottom: isMobile ? 10 : 16,
          }}>
            {[
              { label: 'Articles', value: summary.total_articles },
              { label: 'Questions', value: summary.total_questions },
              { label: 'Categories', value: summary.categories.length },
            ].map((stat, idx) => (
              <div key={stat.label} style={{
                padding: isMobile ? '10px 4px' : '14px 10px',
                textAlign: 'center',
                borderRight: !isMobile || idx < 2 ? '1px solid var(--color-border-light)' : 'none',
              }}>
                <div className="newspaper-heading" style={{
                  fontWeight: 700, fontSize: isMobile ? 20 : 24, color: 'var(--color-text)', lineHeight: 1, marginBottom: 2,
                }}>{stat.value}</div>
                <Text style={{ color: 'var(--color-text-tertiary)', fontSize: isMobile ? 8 : 9, fontWeight: 600, letterSpacing: '0.8px' }}>
                  {stat.label}
                </Text>
              </div>
            ))}
            <div
              onClick={() => handleStartQuiz()}
              style={{
                padding: isMobile ? '10px 4px' : '14px 10px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
              }}
            >
              <ThunderboltOutlined style={{ fontSize: isMobile ? 20 : 24 }} />
              <Text style={{ color: '#fff', fontWeight: 700, fontSize: isMobile ? 9 : 9, display: 'block', marginTop: 1, letterSpacing: '0.5px' }}>Take All</Text>
            </div>
          </div>

          {/* Section divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: isMobile ? 6 : 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border-light)' }} />
            <Text style={{ fontSize: 9, fontWeight: 600, letterSpacing: '1.5px', color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
              Category-wise Quiz
            </Text>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border-light)' }} />
          </div>

          {/* Category grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 0 }}>
            {summary.categories.map((cat: DailyQuizCategory, idx: number) => (
              <div key={cat.id} style={{
                borderBottom: '1px solid var(--color-border-light)',
                borderRight: !isMobile && idx % 2 === 0 ? '1px solid var(--color-border-light)' : 'none',
                padding: isMobile ? '10px 12px' : '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 10, marginBottom: 8 }}>
                  <div style={{
                    width: isMobile ? 28 : 34, height: isMobile ? 28 : 34,
                    background: catColors[cat.name] || '#6366f1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <BookOutlined style={{ fontSize: isMobile ? 13 : 16, color: '#fff' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="newspaper-heading" style={{ fontWeight: 700, fontSize: isMobile ? 14 : 16, color: 'var(--color-text)', lineHeight: 1.2 }}>
                      {cat.name}
                    </div>
                    <Text style={{ color: 'var(--color-text-tertiary)', fontSize: isMobile ? 9 : 10 }}>
                      {cat.article_count} article{cat.article_count !== 1 ? 's' : ''} &middot; {cat.question_count} question{cat.question_count !== 1 ? 's' : ''}
                    </Text>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', borderTop: '1px solid var(--color-border-light)', paddingTop: isMobile ? 6 : 8 }}>
                  <Button
                    type="default" size="small" icon={<EyeOutlined />}
                    onClick={() => setModalCat(cat)}
                    style={{ borderRadius: 2, fontSize: 10, border: '1px solid var(--color-border)', color: 'var(--color-text-tertiary)', background: 'transparent', height: isMobile ? 24 : 26 }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-tertiary)'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-tertiary)' }}
                  >
                    Articles
                  </Button>
                  <Button
                    size="small" icon={<ThunderboltOutlined />}
                    onClick={() => handleStartQuiz(cat.id)}
                    style={{ borderRadius: 2, fontSize: 10, border: '1px solid #6366f1', color: '#6366f1', background: 'transparent', height: isMobile ? 24 : 26 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
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
                      <Avatar shape="square" size={44} icon={<FileTextOutlined />} style={{ borderRadius: 2, background: 'var(--color-surface)', color: '#6366f1' }} />
                    )
                  }
                  title={<Text style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{article.headline}</Text>}
                  description={<Tag style={{ borderRadius: 0, margin: 0, fontSize: 9 }}>{article.source === 'thehindu' ? 'The Hindu' : article.source === 'indianexpress' ? 'Indian Express' : 'PIB'}</Tag>}
                />
                <LinkOutlined style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }} />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  )
}
