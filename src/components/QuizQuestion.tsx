import { Typography } from 'antd'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import type { QuizQuestion as QuizQuestionType } from '@/lib/types'

const { Text } = Typography

const OPTION_LABELS = ['A', 'B', 'C', 'D']

interface QuizQuestionProps {
  question: QuizQuestionType
  selected: string | null
  onSelect: (optionKey: string) => void
  showResults: boolean
  isMobile?: boolean
}

export default function QuizQuestion({
  question,
  selected,
  onSelect,
  showResults,
  isMobile,
}: QuizQuestionProps) {
  return (
    <div style={{ marginBottom: 0 }}>
      <div className="newspaper-heading" style={{
        fontWeight: 600,
        fontSize: isMobile ? 16 : 17,
        lineHeight: 1.4,
        color: 'var(--color-text)',
        whiteSpace: 'pre-line',
        marginBottom: isMobile ? 12 : 14,
      }}>
        {question.question_text}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 8 : 10 }}>
        {Object.entries(question.options).map(([key, value], i) => {
          const isCorrectAnswer = showResults && key === question.correct_answer
          const isWrongAnswer = showResults && key === selected && selected !== question.correct_answer
          const isSelected = key === selected

          let bg = 'transparent'
          let border = '1px solid var(--color-border)'
          let circleBg = 'transparent'
          let circleBorder = '1px solid var(--color-border)'
          let circleColor = 'var(--color-text-tertiary)'
          let textColor = 'var(--color-text-secondary)'

          if (showResults) {
            if (isCorrectAnswer) {
              bg = 'rgba(34, 197, 94, 0.08)'
              border = '1px solid #22c55e'
              circleBg = '#22c55e'
              circleBorder = '1px solid #22c55e'
              circleColor = '#fff'
              textColor = 'var(--color-text)'
            } else if (isWrongAnswer) {
              bg = 'rgba(239, 68, 68, 0.08)'
              border = '1px solid #ef4444'
              circleBg = '#ef4444'
              circleBorder = '1px solid #ef4444'
              circleColor = '#fff'
              textColor = 'var(--color-text)'
            }
          } else if (isSelected) {
            bg = 'rgba(99, 102, 241, 0.08)'
            border = '1px solid #6366f1'
            circleBg = '#6366f1'
            circleBorder = '1px solid #6366f1'
            circleColor = '#fff'
            textColor = 'var(--color-text)'
          }

          return (
            <div
              key={key}
              onClick={() => !showResults && onSelect(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: isMobile ? '12px 14px' : '14px 16px',
                border,
                borderRadius: 10,
                cursor: showResults ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                background: bg,
              }}
              onMouseEnter={(e) => {
                if (!showResults && !isSelected) {
                  e.currentTarget.style.background = 'var(--color-surface)'
                  e.currentTarget.style.borderColor = 'var(--color-text-tertiary)'
                }
              }}
              onMouseLeave={(e) => {
                if (!showResults && !isSelected) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                }
              }}
            >
              <div
                style={{
                  width: isMobile ? 28 : 32,
                  height: isMobile ? 28 : 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: isMobile ? 11 : 12,
                  flexShrink: 0,
                  background: circleBg,
                  border: circleBorder,
                  color: circleColor,
                  transition: 'all 0.15s',
                }}
              >
                {OPTION_LABELS[i]}
              </div>
              <Text style={{ fontSize: isMobile ? 14 : 15, flex: 1, color: textColor, lineHeight: 1.4 }}>
                {value}
              </Text>
              {isCorrectAnswer && <CheckCircleFilled style={{ color: '#22c55e', fontSize: 18 }} />}
              {isWrongAnswer && <CloseCircleFilled style={{ color: '#ef4444', fontSize: 18 }} />}
            </div>
          )
        })}
      </div>

      {showResults && (
        <div
          style={{
            marginTop: isMobile ? 12 : 14,
            padding: isMobile ? '12px 14px' : '14px 16px',
            borderRadius: 10,
            fontSize: isMobile ? 13 : 14,
            background: selected === question.correct_answer
              ? 'rgba(34, 197, 94, 0.06)'
              : 'rgba(234, 179, 8, 0.06)',
            border: selected === question.correct_answer
              ? '1px solid rgba(34, 197, 94, 0.2)'
              : '1px solid rgba(234, 179, 8, 0.2)',
          }}
        >
          <Text strong style={{
            display: 'block',
            marginBottom: 6,
            color: 'var(--color-text)',
            fontSize: isMobile ? 13 : 13,
          }}>
            {selected === question.correct_answer ? 'Correct' : 'Incorrect'}
          </Text>
          {question.explanation && (
            <Text style={{ color: 'var(--color-text-tertiary)', fontSize: isMobile ? 12 : 13, lineHeight: 1.6, display: 'block' }}>
              {question.explanation}
            </Text>
          )}
        </div>
      )}
    </div>
  )
}
