'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Typography, Button, Spin, DatePicker, Card, Row, Col, Tag, Empty, Modal, List, Avatar } from 'antd'
import { CalendarOutlined, ThunderboltOutlined, BookOutlined, FileTextOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useDailyQuizSummary, useStartDailyQuiz } from '@/hooks/useQuizzes'
import { useAuthStore } from '@/stores/authStore'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { DailyQuizCategory } from '@/lib/types'

const { Text, Title } = Typography

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
    if (!token) {
      router.push('/login?callbackUrl=/quiz')
      return
    }
    setError('')
    try {
      const result = await startQuiz.mutateAsync({ date, category_id })
      router.push(`/quiz/${result.quiz_id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to start quiz')
    }
  }

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
  }

  return (
    <div>
      <Card style={{ marginBottom: isMobile ? 12 : 24, borderRadius: 16, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: isMobile ? '12px 14px' : '24px 28px' } }}>
        <Row justify="space-between" align="middle" gutter={[0, 0]}>
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: isMobile ? 28 : 40, height: isMobile ? 28 : 40, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ThunderboltOutlined style={{ fontSize: isMobile ? 14 : 20, color: '#fff' }} />
              </div>
              <Title level={4} style={{ margin: 0, letterSpacing: '-0.5px', fontWeight: 700, color: 'var(--color-text)', fontSize: isMobile ? 16 : 20 }}>
                Daily Quiz
              </Title>
            </div>
          </Col>
          <Col>
            <DatePicker
              value={dayjs(date)}
              onChange={(d) => { if (d) { setDate(d.format('YYYY-MM-DD')); setError('') } }}
              allowClear={false}
              format="DD-MM-YYYY"
              suffixIcon={<CalendarOutlined style={{ fontSize: 12 }} />}
              style={{ width: isMobile ? 130 : 160 }}
              size={isMobile ? 'small' : 'middle'}
            />
          </Col>
        </Row>
      </Card>

      {error && (
        <Card style={{ marginBottom: 20, borderRadius: 12, background: 'var(--color-surface)', border: '1px solid #ef4444' }} styles={{ body: { padding: '14px 20px' } }}>
          <Text style={{ color: '#fca5a5' }}>{error}</Text>
        </Card>
      )}

      {isLoading ? (
        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 24px', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: '80px 24px' } }}>
          <Spin size="large" />
        </Card>
      ) : !summary || summary.categories.length === 0 ? (
        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '60px 24px', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: '60px 24px' } }}>
          <Empty
            description={
              <div>
                <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 15, display: 'block', marginBottom: 4 }}>
                  No quizzes available for {dayjs(date).format('DD-MM-YYYY')}
                </Text>
                <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>
                  Articles need to be scraped and summarized first
                </Text>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <>
          <Row gutter={[6, 6]} style={{ marginBottom: isMobile ? 12 : 24 }}>
            <Col xs={8} sm={4}>
              <Card style={{ borderRadius: 10, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }} styles={{ body: { padding: isMobile ? '8px 4px' : '14px 10px' } }}>
                <Text style={{ color: 'var(--color-text)', fontSize: isMobile ? 20 : 26, fontWeight: 700, display: 'block' }}>{summary.total_articles}</Text>
                <Text style={{ color: 'var(--color-text-tertiary)', fontSize: isMobile ? 9 : 11 }}>Articles</Text>
              </Card>
            </Col>
            <Col xs={8} sm={4}>
              <Card style={{ borderRadius: 10, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }} styles={{ body: { padding: isMobile ? '8px 4px' : '14px 10px' } }}>
                <Text style={{ color: 'var(--color-text)', fontSize: isMobile ? 20 : 26, fontWeight: 700, display: 'block' }}>{summary.total_questions}</Text>
                <Text style={{ color: 'var(--color-text-tertiary)', fontSize: isMobile ? 9 : 11 }}>Questions</Text>
              </Card>
            </Col>
            <Col xs={8} sm={4}>
              <Card style={{ borderRadius: 10, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }} styles={{ body: { padding: isMobile ? '8px 4px' : '14px 10px' } }}>
                <Text style={{ color: 'var(--color-text)', fontSize: isMobile ? 20 : 26, fontWeight: 700, display: 'block' }}>{summary.categories.length}</Text>
                <Text style={{ color: 'var(--color-text-tertiary)', fontSize: isMobile ? 9 : 11 }}>Categories</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                hoverable
                style={{ borderRadius: 10, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none', cursor: 'pointer', height: '100%' }}
                styles={{ body: { padding: isMobile ? '10px 14px' : '16px 20px' } }}
                onClick={() => handleStartQuiz()}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <ThunderboltOutlined style={{ fontSize: isMobile ? 16 : 20, color: '#fff' }} />
                  <div>
                    <Text style={{ color: '#fff', fontSize: isMobile ? 14 : 16, fontWeight: 700, display: 'block' }}>Take All Quiz</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? 10 : 12 }}>All categories combined</Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            {summary.categories.map((cat: DailyQuizCategory) => (
              <Col xs={24} sm={12} lg={8} key={cat.id}>
                <Card
                  style={{
                    borderRadius: 10,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    height: '100%',
                    transition: 'all 0.2s',
                  }}
                  styles={{ body: { padding: isMobile ? '10px 12px 8px' : '16px 18px 12px' } }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{
                      width: isMobile ? 28 : 36, height: isMobile ? 28 : 36, borderRadius: 8,
                      background: catColors[cat.name] || '#6366f1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <BookOutlined style={{ fontSize: isMobile ? 13 : 16, color: '#fff' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text strong style={{ color: 'var(--color-text)', fontSize: isMobile ? 13 : 15, display: 'block', lineHeight: 1.3 }}>
                        {cat.name}
                      </Text>
                      <div style={{ display: 'flex', gap: 6, marginTop: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Text style={{ color: 'var(--color-text-tertiary)', fontSize: isMobile ? 10 : 11 }}>
                          {cat.article_count} article{cat.article_count !== 1 ? 's' : ''}
                        </Text>
                        <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--color-text-tertiary)', display: 'inline-block' }} />
                        <Text style={{ color: '#6366f1', fontSize: isMobile ? 10 : 11, fontWeight: 600 }}>
                          {cat.question_count} question{cat.question_count !== 1 ? 's' : ''}
                        </Text>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, borderTop: '1px solid var(--color-border)', paddingTop: 8 }}>
                    <Button
                      type="default"
                      icon={<EyeOutlined />}
                      onClick={() => setModalCat(cat)}
                      style={{ borderRadius: 7, color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)', fontSize: 12 }}
                      size="small"
                    >
                      Articles
                    </Button>
                    <Button
                      type="default"
                      icon={<ThunderboltOutlined />}
                      onClick={() => handleStartQuiz(cat.id)}
                      style={{ borderRadius: 7, fontSize: 12, background: 'transparent', borderColor: '#6366f1', color: '#6366f1' }}
                      size="small"
                    >
                      Start Quiz
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOutlined style={{ color: '#6366f1' }} />
            <span>{modalCat?.name} — Articles</span>
          </div>
        }
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
                style={{ padding: '12px 16px', cursor: 'pointer' }}
                onClick={() => window.open(article.url, '_blank')}
              >
                <List.Item.Meta
                  avatar={
                    article.image_url ? (
                      <Avatar shape="square" size={48} src={article.image_url} style={{ borderRadius: 8 }} />
                    ) : (
                      <Avatar shape="square" size={48} icon={<FileTextOutlined />} style={{ borderRadius: 8, background: 'var(--color-surface)', color: '#6366f1' }} />
                    )
                  }
                  title={
                    <Text style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>
                      {article.headline}
                    </Text>
                  }
                  description={
                    <Tag style={{ borderRadius: 4, margin: 0, fontSize: 11 }}>
                      {article.source === 'thehindu' ? 'The Hindu' : 'Indian Express'}
                    </Tag>
                  }
                />
                <LinkOutlined style={{ color: 'var(--color-text-tertiary)', fontSize: 14 }} />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  )
}
