'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Button, Typography, Spin, Card, Progress, Modal } from 'antd'
import { api } from '@/lib/api'
import type { Quiz } from '@/lib/types'
import QuizQuestionComponent from '@/components/QuizQuestion'
import QuizResult from '@/components/QuizResult'
import { QuizSkeleton } from '@/components/Skeletons'

const { Title, Text } = Typography

const QUIZ_TIME_LIMIT_SEC = 600

export default function TakeQuizPage() {
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
        <div style={{ padding: '10px 14px', border: '1px solid #c62828', borderRadius: 6, background: '#ffebee', color: '#c62828', marginBottom: 16, fontSize: 14, display: 'inline-block' }}>
          {error}
        </div>
        <div>
          <Button onClick={() => window.location.reload()} style={{ fontWeight: 600 }}>
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
          <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 16 }}>
            Questions &amp; Answers
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
        className="article-card"
        styles={{ body: { padding: 18 } }}
        style={{ marginBottom: 20 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Title level={4} style={{ margin: 0, fontSize: 16 }}>{quiz.title || 'Quiz'}</Title>
            {quiz.articles?.length ? (
              <Text style={{ fontSize: 12, color: '#9e9e9e' }}>
                Based on {quiz.articles.length} article{quiz.articles.length > 1 ? 's' : ''}
              </Text>
            ) : null}
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <Text strong style={{ fontSize: 15, color: timeLeft < 60 ? '#c62828' : timeLeft < 180 ? '#e65100' : '#555' }}>
                {formatTime(timeLeft)}
              </Text>
              <Text style={{ fontSize: 12, color: '#bbb', display: 'block' }}>remaining</Text>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Text strong style={{ fontSize: 15, color: answered === total ? '#2e7d32' : '#555' }}>
                {answered}/{total}
              </Text>
              <Text style={{ fontSize: 12, color: '#bbb', display: 'block' }}>answered</Text>
            </div>
          </div>
        </div>
        <Progress
          percent={Math.round((answered / total) * 100)}
          showInfo={false}
          strokeColor={answered === total ? '#2e7d32' : '#1a1a1a'}
          trailColor="#e8e8e8"
          size="small"
          style={{ marginTop: 12, marginBottom: 0 }}
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

      <div style={{ textAlign: 'center', marginTop: 28, marginBottom: 32 }}>
        <Button
          type="primary"
          size="large"
          loading={submitting}
          onClick={handleSubmit}
          style={{
            height: 46,
            padding: '0 40px',
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Submit Answers ({answered}/{total})
        </Button>
      </div>
    </div>
  )
}
