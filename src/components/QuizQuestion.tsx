'use client'

import { Typography } from 'antd'
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
    <div>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)',
        marginBottom: 8,
      }}>
        Question {index + 1}
      </div>
      <div className="newspaper-heading" style={{
        fontWeight: 600,
        fontSize: 16,
        lineHeight: 1.4,
        color: 'var(--color-text)',
        whiteSpace: 'pre-line',
        marginBottom: 16,
      }}>
        {question.question_text}
      </div>

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
                padding: '10px 12px',
                border: '1px solid',
                cursor: showResults ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                background: isCorrectAnswer ? 'rgba(34, 197, 94, 0.06)' : isWrongAnswer ? 'rgba(239, 68, 68, 0.06)' : isSelected ? 'rgba(99, 102, 241, 0.04)' : 'transparent',
                borderColor: isCorrectAnswer ? '#22c55e' : isWrongAnswer ? '#ef4444' : isSelected ? '#6366f1' : 'var(--color-border)',
              }}
              onClick={() => !showResults && onSelect(key)}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid',
                  fontWeight: 700,
                  fontSize: 10,
                  flexShrink: 0,
                  background: isCorrectAnswer ? 'rgba(34, 197, 94, 0.1)' : isWrongAnswer ? 'rgba(239, 68, 68, 0.1)' : isSelected ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  borderColor: isCorrectAnswer ? '#22c55e' : isWrongAnswer ? '#ef4444' : isSelected ? '#6366f1' : 'var(--color-border)',
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
            border: '1px solid',
            fontSize: 13,
            background: selected === question.correct_answer ? 'rgba(34, 197, 94, 0.06)' : 'rgba(234, 179, 8, 0.06)',
            borderColor: selected === question.correct_answer ? '#22c55e' : '#eab308',
          }}
        >
          <Text strong style={{
            display: 'block',
            marginBottom: 4,
            color: 'var(--color-text)',
            fontSize: 13,
          }}>
            {selected === question.correct_answer ? '✓ Correct' : '✗ Incorrect'}
          </Text>
          {question.explanation && (
            <Text style={{ color: 'var(--color-text-tertiary)' }}>{question.explanation}</Text>
          )}
        </div>
      )}
    </div>
  )
}
