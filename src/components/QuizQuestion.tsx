'use client'

import { Card, Typography, Radio, Space } from 'antd'
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
      className="glass-card fade-in"
      styles={{ body: { padding: 20 } }}
      style={{ marginBottom: 16 }}
    >
      <Text style={{ fontSize: 12, display: 'block', marginBottom: 10, opacity: 0.5, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Question {index + 1}
      </Text>
      <Text strong style={{ display: 'block', marginBottom: 20, fontSize: 16, lineHeight: 1.45 }}>
        {question.question_text}
      </Text>

      <Radio.Group
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        disabled={showResults}
        style={{ width: '100%' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
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
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid',
                  cursor: showResults ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  background: isSelected && !showResults ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  borderColor: isCorrectAnswer ? 'rgba(16, 185, 129, 0.4)' : isWrongAnswer ? 'rgba(244, 67, 94, 0.4)' : isSelected && !showResults ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.06)',
                }}
                onClick={() => !showResults && onSelect(key)}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                    border: '1px solid',
                    fontWeight: 700,
                    fontSize: 12,
                    flexShrink: 0,
                    background: isCorrectAnswer ? 'rgba(16, 185, 129, 0.15)' : isWrongAnswer ? 'rgba(244, 67, 94, 0.15)' : isSelected && !showResults ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    borderColor: isCorrectAnswer ? 'rgba(16, 185, 129, 0.5)' : isWrongAnswer ? 'rgba(244, 67, 94, 0.5)' : isSelected && !showResults ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {OPTION_LABELS[i]}
                </div>
                <span style={{ fontSize: 14, flex: 1 }}>{value}</span>
                {isCorrectAnswer && <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--ant-color-success)' }}>✓</span>}
                {isWrongAnswer && <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--ant-color-error)' }}>✗</span>}
              </div>
            )
          })}
        </Space>
      </Radio.Group>

      {showResults && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 8,
            border: '1px solid',
            fontSize: 14,
            background: selected === question.correct_answer ? 'rgba(16, 185, 129, 0.06)' : 'rgba(244, 67, 94, 0.06)',
            borderColor: selected === question.correct_answer ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 67, 94, 0.2)',
          }}
        >
          <Text strong style={{ display: 'block', marginBottom: 6 }}>
            {selected === question.correct_answer ? 'Correct' : 'Incorrect'}
          </Text>
          {question.explanation && (
            <Text style={{ opacity: 0.8 }}>{question.explanation}</Text>
          )}
        </div>
      )}
    </Card>
  )
}
