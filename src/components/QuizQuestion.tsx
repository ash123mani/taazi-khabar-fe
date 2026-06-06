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
      className="article-card fade-in"
      styles={{ body: { padding: 24 } }}
      style={{ marginBottom: 16 }}
    >
      <Text style={{ fontSize: 12, display: 'block', marginBottom: 10, color: '#9e9e9e', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Question {index + 1}
      </Text>
      <Text strong style={{ display: 'block', marginBottom: 20, fontSize: 16, lineHeight: 1.45, color: '#1a1a1a' }}>
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
                  borderRadius: 4,
                  border: '1px solid',
                  cursor: showResults ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  background: isSelected && !showResults ? '#f5f5f5' : '#ffffff',
                  borderColor: isCorrectAnswer ? '#2e7d32' : isWrongAnswer ? '#c62828' : isSelected && !showResults ? '#9e9e9e' : '#e0e0e0',
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
                    borderRadius: 4,
                    border: '1px solid',
                    fontWeight: 700,
                    fontSize: 12,
                    flexShrink: 0,
                    background: isCorrectAnswer ? '#e8f5e9' : isWrongAnswer ? '#ffebee' : isSelected && !showResults ? '#eeeeee' : '#fafafa',
                    borderColor: isCorrectAnswer ? '#2e7d32' : isWrongAnswer ? '#c62828' : isSelected && !showResults ? '#9e9e9e' : '#e0e0e0',
                  }}
                >
                  {OPTION_LABELS[i]}
                </div>
                <span style={{ fontSize: 14, flex: 1, color: '#1a1a1a' }}>{value}</span>
                {isCorrectAnswer && <span style={{ fontWeight: 700, fontSize: 13, color: '#2e7d32' }}>✓</span>}
                {isWrongAnswer && <span style={{ fontWeight: 700, fontSize: 13, color: '#c62828' }}>✗</span>}
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
            borderRadius: 4,
            border: '1px solid',
            fontSize: 14,
            background: selected === question.correct_answer ? '#f1f8e9' : '#fff3e0',
            borderColor: selected === question.correct_answer ? '#a5d6a7' : '#ffcc80',
          }}
        >
          <Text strong style={{ display: 'block', marginBottom: 6, color: '#1a1a1a' }}>
            {selected === question.correct_answer ? 'Correct' : 'Incorrect'}
          </Text>
          {question.explanation && (
            <Text style={{ color: '#616161' }}>{question.explanation}</Text>
          )}
        </div>
      )}
    </Card>
  )
}
