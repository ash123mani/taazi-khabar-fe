'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button, Typography, Spin, Card } from 'antd'
import { api } from '@/lib/api'
import type { Quiz } from '@/lib/types'
import QuizQuestionComponent from '@/components/QuizQuestion'
import QuizResult from '@/components/QuizResult'

const { Title, Text } = Typography

export default function TakeQuizPage() {
  const params = useParams()
  const id = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const handleSelect = (questionId: string, optionKey: string) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }))
  }

  const handleSubmit = async () => {
    const unanswered = Object.entries(answers).filter(([, v]) => !v)
    if (unanswered.length > 0) {
      if (!confirm(`${unanswered.length} question(s) unanswered. Submit anyway?`)) return
    }

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
  }

  const answered = Object.values(answers).filter(Boolean).length
  const total = quiz?.questions?.length || 0

  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', padding: 48 }}>
        <div style={{ padding: 20, border: '1px solid var(--ant-color-error)', marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
        <Button onClick={() => window.location.reload()} style={{ fontWeight: 600 }}>
          Retry
        </Button>
      </div>
    )
  }

  if (!quiz) return null

  if (submitted && quiz.score !== null) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <QuizResult quiz={quiz} />
        <div style={{ marginTop: 32 }}>
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
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <Card
        className="glass-card"
        styles={{ body: { padding: 20 } }}
        style={{ marginBottom: 24 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>{quiz.title || 'Quiz'}</Title>
            <Text style={{ fontSize: 13, opacity: 0.6 }}>
              {total} questions
              {quiz.articles?.length ? ` · ${quiz.articles.length} articles` : ''}
            </Text>
          </div>
          <div style={{
            padding: '6px 14px',
            borderRadius: 8,
            border: '1px solid',
            fontWeight: 700,
            fontSize: 14,
            background: 'rgba(99, 102, 241, 0.08)',
            borderColor: 'rgba(99, 102, 241, 0.2)',
          }}>
            {answered}/{total}
          </div>
        </div>
      </Card>

      {quiz.questions?.map((question, i) => (
        <QuizQuestionComponent
          key={question.id}
          question={question}
          index={i}
          selected={answers[question.id] || null}
          onSelect={(optionKey) => handleSelect(question.id, optionKey)}
          showResults={false}
        />
      ))}

      <div style={{ textAlign: 'center', marginTop: 32, marginBottom: 32 }}>
        <Button
          type="primary"
          size="large"
          loading={submitting}
          onClick={handleSubmit}
          style={{
            height: 48,
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
