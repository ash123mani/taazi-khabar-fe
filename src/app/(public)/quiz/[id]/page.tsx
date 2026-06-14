'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Button, Typography, Spin, Card, Progress, Modal } from 'antd'
import { api } from '@/lib/api'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Quiz } from '@/lib/types'
import QuizQuestionComponent from '@/components/QuizQuestion'
import QuizResult from '@/components/QuizResult'
import { QuizSkeleton } from '@/components/Skeletons'

const { Title, Text } = Typography

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
      const data = await api.submitQuiz(id, answers)
      setQuiz(data)
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
        <div style={{ padding: '10px 14px', border: '1px solid #ef4444', borderRadius: 6, background: 'rgba(239,68,68,0.1)', color: '#fca5a5', marginBottom: 16, fontSize: 14, display: 'inline-block' }}>
          {error}
        </div>
        <div>
          <Button onClick={() => window.location.reload()} type="default" style={{ fontWeight: 600, borderRadius: 8 }}>
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
          <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 16, color: '#ffffff' }}>
            Questions & Answers
          </Text>
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
      <Card
        style={{ marginBottom: isMobile ? 12 : 20, background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: 10 }}
        styles={{ body: { padding: isMobile ? 12 : 18 } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <Title level={5} style={{ margin: 0, fontSize: isMobile ? 14 : 16, color: '#ffffff' }}>{quiz.title || 'Quiz'}</Title>
            {quiz.articles?.length && !isMobile ? (
              <Text style={{ fontSize: 12, color: '#6b6b6b' }}>
                Based on {quiz.articles.length} article{quiz.articles.length > 1 ? 's' : ''}
              </Text>
            ) : null}
          </div>
          <div style={{ display: 'flex', gap: isMobile ? 12 : 20, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <Text strong style={{ fontSize: isMobile ? 13 : 15, color: timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#eab308' : '#a1a1a1' }}>
                {formatTime(timeLeft)}
              </Text>
              <Text style={{ fontSize: 10, color: '#6b6b6b', display: 'block' }}>left</Text>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Text strong style={{ fontSize: isMobile ? 13 : 15, color: answered === total ? '#22c55e' : '#a1a1a1' }}>
                {answered}/{total}
              </Text>
              <Text style={{ fontSize: 10, color: '#6b6b6b', display: 'block' }}>done</Text>
            </div>
          </div>
        </div>
        <Progress
          percent={Math.round((answered / total) * 100)}
          showInfo={false}
          strokeColor={answered === total ? '#22c55e' : '#6366f1'}
          trailColor="#1f1f1f"
          size="small"
          style={{ marginTop: 8, marginBottom: 0 }}
        />
      </Card>

      {quiz.questions?.map((question, i) => (
        <QuizQuestionComponent
          key={question.id}
          question={question}
          index={i}
          selected={answers[question.id] || null}
          onSelect={(optionKey) => {
            if (submitted) return
            setAnswers((prev) => ({ ...prev, [question.id]: optionKey }))
          }}
          showResults={false}
        />
      ))}

      <div style={{ textAlign: 'center', marginTop: isMobile ? 20 : 28, marginBottom: isMobile ? 20 : 32 }}>
        <Button
          type="primary"
          size={isMobile ? 'middle' : 'large'}
          loading={submitting}
          onClick={handleSubmit}
          style={{
            height: isMobile ? 40 : 46,
            padding: isMobile ? '0 24px' : '0 40px',
            fontWeight: 700,
            fontSize: isMobile ? 13 : 15,
            borderRadius: 10,
          }}
        >
          Submit Answers ({answered}/{total})
        </Button>
      </div>
    </div>
  )
}
