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
      className="article-card fade-in"
      styles={{ body: { padding: 20 } }}
      style={{ marginBottom: 14 }}
    >
      <Text style={{ fontSize: 11, display: 'block', marginBottom: 8, color: '#bbb', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Question {index + 1}
      </Text>
      <Text strong style={{ display: 'block', marginBottom: 18, fontSize: 15, lineHeight: 1.5, color: '#1a1a1a' }}>
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
                background: isCorrectAnswer ? '#f1f8e9' : isWrongAnswer ? '#ffebee' : isSelected ? '#f5f5f5' : '#ffffff',
                borderColor: isCorrectAnswer ? '#a5d6a7' : isWrongAnswer ? '#ef9a9a' : isSelected ? '#bdbdbd' : '#e8e8e8',
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
                  background: isCorrectAnswer ? '#c8e6c9' : isWrongAnswer ? '#ffcdd2' : isSelected ? '#e0e0e0' : '#f5f5f5',
                  borderColor: isCorrectAnswer ? '#66bb6a' : isWrongAnswer ? '#ef5350' : isSelected ? '#9e9e9e' : '#e0e0e0',
                  color: isCorrectAnswer ? '#1b5e20' : isWrongAnswer ? '#b71c1c' : isSelected ? '#424242' : '#757575',
                }}
              >
                {OPTION_LABELS[i]}
              </div>
              <span style={{ fontSize: 14, flex: 1, color: '#1a1a1a', lineHeight: 1.4 }}>{value}</span>
              {isCorrectAnswer && <span style={{ fontWeight: 700, fontSize: 14, color: '#2e7d32' }}>✓</span>}
              {isWrongAnswer && <span style={{ fontWeight: 700, fontSize: 14, color: '#c62828' }}>✗</span>}
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
            background: selected === question.correct_answer ? '#f1f8e9' : '#fff8e1',
            borderColor: selected === question.correct_answer ? '#a5d6a7' : '#ffe082',
          }}
        >
          <Text strong style={{ display: 'block', marginBottom: 4, color: '#1a1a1a', fontSize: 13 }}>
            {selected === question.correct_answer ? '✅ Correct' : '❌ Incorrect'}
          </Text>
          {question.explanation && (
            <Text style={{ color: '#616161' }}>{question.explanation}</Text>
          )}
        </div>
      )}
    </Card>
  )
}
