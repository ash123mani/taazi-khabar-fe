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
      style={{
        border: '2px solid #000',
        borderRadius: 0,
        marginBottom: 16,
        boxShadow: 'none',
      }}
      styles={{ body: { padding: 20 } }}
    >
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8, color: '#999' }}>
        Question {index + 1}
      </Text>
      <Text strong style={{ display: 'block', marginBottom: 20, fontSize: 16, lineHeight: 1.4 }}>
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
            const borderColor = isCorrectAnswer ? '#000' : isWrongAnswer ? '#000' : isSelected ? '#000' : '#ccc'
            const bgColor = isCorrectAnswer ? '#e8e8e8' : isWrongAnswer ? '#f0f0f0' : isSelected ? '#f5f5f5' : '#fff'

            return (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  border: `2px solid ${borderColor}`,
                  background: bgColor,
                  cursor: showResults ? 'default' : 'pointer',
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
                    border: '2px solid #000',
                    background: isSelected || isCorrectAnswer ? '#000' : '#fff',
                    color: isSelected || isCorrectAnswer ? '#fff' : '#000',
                    fontWeight: 700,
                    fontSize: 12,
                    flexShrink: 0,
                  }}
                >
                  {OPTION_LABELS[i]}
                </div>
                <span style={{ fontSize: 14, color: '#000', flex: 1 }}>{value}</span>
                {isCorrectAnswer && <span style={{ fontWeight: 700, fontSize: 12 }}>✓</span>}
                {isWrongAnswer && <span style={{ fontWeight: 700, fontSize: 12 }}>✗</span>}
              </div>
            )
          })}
        </Space>
      </Radio.Group>

      {showResults && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            border: '2px solid #000',
            background: '#f5f5f5',
            fontSize: 14,
          }}
        >
          <Text strong style={{ display: 'block', marginBottom: 4 }}>
            {selected === question.correct_answer ? 'Correct' : 'Incorrect'}
          </Text>
          {question.explanation && (
            <Text style={{ color: '#666' }}>{question.explanation}</Text>
          )}
        </div>
      )}
    </Card>
  )
}
