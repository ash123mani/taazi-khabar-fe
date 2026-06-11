'use client'

import { Card, Typography } from 'antd'
import type { QuizQuestion as QuizQuestionType } from '@/lib/types'

const { Text } = Typography

const OPTION_LABELS = ['A', 'B', 'C', 'D']

interface QuizQuestionProps {
  question: QuizQuestionType
  index: number
  selected: string | null
  onSelect: (optionKey: string) => void
  showResults: boolean
}

export default function QuizQuestion({
  question,
  index,
  selected,
  onSelect,
  showResults,
}: QuizQuestionProps) {
  return (
    <Card
      style={{ borderRadius: 12, marginBottom: 14, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
      styles={{ body: { padding: 20 } }}
    >
      <Text style={{ fontSize: 11, display: 'block', marginBottom: 8, color: 'var(--color-text-tertiary)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Question {index + 1}
      </Text>
      <Text strong style={{ display: 'block', marginBottom: 18, fontSize: 15, lineHeight: 1.5, color: 'var(--color-text)' }}>
        {question.question_text}
      </Text>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(question.options).map(([key, value], i) => {
          const isCorrectAnswer = showResults && key === question.correct_answer
          const isWrongAnswer = showResults && key === selected && selected !== question.correct_answer
          const isSelected = key === selected

          return (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 6,
                border: '1px solid',
                cursor: showResults ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                background: isCorrectAnswer ? 'rgba(34, 197, 94, 0.08)' : isWrongAnswer ? 'rgba(239, 68, 68, 0.08)' : isSelected ? 'var(--color-surface)' : '#000000',
                borderColor: isCorrectAnswer ? '#22c55e' : isWrongAnswer ? '#ef4444' : isSelected ? '#6366f1' : 'var(--color-border)',
              }}
              onClick={() => !showResults && onSelect(key)}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  border: '1px solid',
                  fontWeight: 700,
                  fontSize: 11,
                  flexShrink: 0,
                  background: isCorrectAnswer ? 'rgba(34, 197, 94, 0.15)' : isWrongAnswer ? 'rgba(239, 68, 68, 0.15)' : isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--color-surface)',
                  borderColor: isCorrectAnswer ? '#22c55e' : isWrongAnswer ? '#ef4444' : isSelected ? '#6366f1' : '#2a2a2a',
                  color: isCorrectAnswer ? '#22c55e' : isWrongAnswer ? '#ef4444' : isSelected ? '#818cf8' : 'var(--color-text-tertiary)',
                }}
              >
                {OPTION_LABELS[i]}
              </div>
              <span style={{ fontSize: 14, flex: 1, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{value}</span>
              {isCorrectAnswer && <span style={{ fontWeight: 700, fontSize: 14, color: '#22c55e' }}>✓</span>}
              {isWrongAnswer && <span style={{ fontWeight: 700, fontSize: 14, color: '#ef4444' }}>✗</span>}
            </div>
          )
        })}
      </div>

      {showResults && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 6,
            border: '1px solid',
            fontSize: 13,
            background: selected === question.correct_answer ? 'rgba(34, 197, 94, 0.08)' : 'rgba(234, 179, 8, 0.08)',
            borderColor: selected === question.correct_answer ? '#22c55e' : '#eab308',
          }}
        >
          <Text strong style={{ display: 'block', marginBottom: 4, color: 'var(--color-text)', fontSize: 13 }}>
            {selected === question.correct_answer ? '✓ Correct' : '✗ Incorrect'}
          </Text>
          {question.explanation && (
            <Text style={{ color: 'var(--color-text-tertiary)' }}>{question.explanation}</Text>
          )}
        </div>
      )}
    </Card>
  )
}
