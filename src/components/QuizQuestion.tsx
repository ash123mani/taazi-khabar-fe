'use client';

import { QuizQuestion as QuizQuestionType } from '@/lib/types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  index: number;
  selected: string | null;
  onSelect: (optionKey: string) => void;
  showResults: boolean;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizQuestion({
  question,
  index,
  selected,
  onSelect,
  showResults,
}: QuizQuestionProps) {
  const isCorrect = selected === question.correct_answer;

  const getOptionClass = (key: string) => {
    const base =
      'w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex items-center gap-3';

    if (!showResults) {
      if (selected === key) return `${base} border-accent bg-accent/10 text-accent`;
      return `${base} border-surface-border bg-surface-card text-text-secondary hover:border-text-muted`;
    }

    if (key === question.correct_answer) {
      return `${base} border-green-500 bg-green-500/10 text-green-300`;
    }
    if (key === selected && !isCorrect) {
      return `${base} border-red-500 bg-red-500/10 text-red-300`;
    }
    return `${base} border-surface-border bg-surface-card/50 text-text-muted opacity-60`;
  };

  return (
    <div className="bg-surface-card border border-surface-border rounded-lg p-5">
      <p className="text-sm font-medium text-text-muted mb-1">Question {index + 1}</p>
      <p className="text-text-primary font-medium mb-4">{question.question_text}</p>

      <div className="space-y-2">
        {Object.entries(question.options).map(([key, value], i) => (
          <button
            key={key}
            disabled={showResults}
            onClick={() => onSelect(key)}
            className={getOptionClass(key)}
          >
            <span className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-xs font-bold shrink-0">
              {OPTION_LABELS[i]}
            </span>
            <span>{value}</span>
          </button>
        ))}
      </div>

      {showResults && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            isCorrect
              ? 'bg-green-500/10 text-green-300 border border-green-500/30'
              : 'bg-red-500/10 text-red-300 border border-red-500/30'
          }`}
        >
          <p className="font-medium mb-1">{isCorrect ? 'Correct' : 'Incorrect'}</p>
          {question.explanation && <p>{question.explanation}</p>}
        </div>
      )}
    </div>
  );
}
