'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Button, Typography, Spin, Progress, Modal } from 'antd'
import { api } from '@/lib/api'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Quiz } from '@/lib/types'
import QuizQuestionComponent from '@/components/QuizQuestion'
import QuizResult from '@/components/QuizResult'
import { QuizSkeleton } from '@/components/Skeletons'

const { Text } = Typography

const QUIZ_TIME_LIMIT_SEC = 600

export default function TakeQuizPage() {
  const isMobile = useIsMobile()
  const params = useParams()
  const id = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_LIMIT_SEC)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!id) return
    api
      .getQuiz(id)
      .then((data) => {
        setQuiz(data)
        const initial: Record<string, string> = {}
        data.questions?.forEach((q: any) => (initial[q.id] = ''))
        setAnswers(initial)
      })
      .catch(() => setError('Failed to load quiz'))
      .finally(() => setLoading(false))
  }, [id])

  const doSubmit = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (submitted) return
    setSubmitting(true)
    try {
      await api.submitQuiz(id, answers)
      const refreshed = await api.getQuiz(id)
      setQuiz(refreshed)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }, [id, answers, submitted])

  useEffect(() => {
    if (loading || submitted || error) return
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          doSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [loading, submitted, error, doSubmit])

  const handleSubmit = () => {
    const unanswered = Object.entries(answers).filter(([, v]) => !v)
    if (unanswered.length > 0) {
      Modal.confirm({
        title: 'Submit quiz?',
        content: `${unanswered.length} question(s) unanswered. Submit anyway?`,
        okText: 'Submit',
        cancelText: 'Review',
        onOk: doSubmit,
      })
    } else {
      doSubmit()
    }
  }

  const answered = Object.values(answers).filter(Boolean).length
  const total = quiz?.questions?.length || 0

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  if (loading) return <QuizSkeleton />

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <div style={{ padding: '10px 14px', border: '1px solid #ef4444', color: '#fca5a5', marginBottom: 16, fontSize: 13, display: 'inline-block' }}>
          {error}
        </div>
        <div>
          <Button onClick={() => window.location.reload()} type="default" style={{ fontWeight: 600, borderRadius: 0 }}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!quiz) return null

  if (submitted && quiz.score !== null) {
    return (
      <div>
        <QuizResult quiz={quiz} />
        <div style={{ marginTop: 28 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <Text style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)',
              whiteSpace: 'nowrap',
            }}>
              Questions &amp; Answers
            </Text>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>
          {quiz.questions?.map((question, i) => (
            <QuizQuestionComponent
              key={question.id}
              question={question}
              index={i}
              selected={answers[question.id] || null}
              onSelect={() => {}}
              showResults
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: isMobile ? 10 : 14,
        marginBottom: isMobile ? 12 : 20,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 8,
        }}>
          <div>
            <div className="newspaper-heading" style={{
              fontWeight: 900,
              fontSize: isMobile ? 20 : 28,
              letterSpacing: '-0.5px',
              color: 'var(--color-text)',
              lineHeight: 1.1,
            }}>
              {quiz.title || 'Quiz'}
            </div>
            {quiz.articles?.length && !isMobile ? (
              <Text style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--color-text-tertiary)', marginTop: 2, display: 'block' }}>
                Based on {quiz.articles.length} article{quiz.articles.length > 1 ? 's' : ''}
              </Text>
            ) : null}
          </div>
          <div style={{ display: 'flex', gap: isMobile ? 16 : 24, alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--color-text-tertiary)',
                display: 'block',
                marginBottom: 2,
              }}>
                Time
              </Text>
              <div className="newspaper-heading" style={{
                fontWeight: 700,
                fontSize: isMobile ? 18 : 22,
                lineHeight: 1,
                color: timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#eab308' : 'var(--color-text)',
              }}>
                {formatTime(timeLeft)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Text style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--color-text-tertiary)',
                display: 'block',
                marginBottom: 2,
              }}>
                Done
              </Text>
              <div className="newspaper-heading" style={{
                fontWeight: 700,
                fontSize: isMobile ? 18 : 22,
                lineHeight: 1,
                color: answered === total ? '#22c55e' : 'var(--color-text)',
              }}>
                {answered}/{total}
              </div>
            </div>
          </div>
        </div>
        <Progress
          percent={Math.round((answered / total) * 100)}
          showInfo={false}
          strokeColor={answered === total ? '#22c55e' : '#6366f1'}
          trailColor="var(--color-border)"
          size="small"
          style={{ marginTop: 10, marginBottom: 0 }}
        />
      </div>

      {quiz.questions?.map((question, i) => (
        <div key={question.id} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: isMobile ? 8 : 12, marginBottom: isMobile ? 10 : 16 }}>
          <QuizQuestionComponent
            question={question}
            index={i}
            selected={answers[question.id] || null}
            onSelect={(optionKey) => {
              if (submitted) return
              setAnswers((prev) => ({ ...prev, [question.id]: optionKey }))
            }}
            showResults={false}
          />
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: isMobile ? 20 : 28, marginBottom: isMobile ? 20 : 32 }}>
        <Button
          type="primary"
          size={isMobile ? 'middle' : 'large'}
          loading={submitting}
          onClick={handleSubmit}
          style={{
            height: isMobile ? 40 : 46,
            padding: isMobile ? '0 28px' : '0 44px',
            fontWeight: 700,
            fontSize: isMobile ? 12 : 13,
            borderRadius: 0,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          Submit Answers ({answered}/{total})
        </Button>
      </div>
    </div>
  )
}
