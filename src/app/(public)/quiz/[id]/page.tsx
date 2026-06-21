'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button, Typography, Spin, Progress, Modal } from 'antd';
import { ClockCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { api } from '@/lib/api';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { Quiz } from '@/lib/types';
import QuizQuestionComponent from '@/components/QuizQuestion';
import QuizResult from '@/components/QuizResult';
import { QuizSkeleton } from '@/components/Skeletons';

const { Text } = Typography;

const QUIZ_TIME_LIMIT_SEC = 600;

export default function TakeQuizPage() {
  const isMobile = useIsMobile();
  const params = useParams();
  const id = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_LIMIT_SEC);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getQuiz(id)
      .then((data) => {
        setQuiz(data);
        const initial: Record<string, string> = {};
        data.questions?.forEach((q: any) => (initial[q.id] = ''));
        setAnswers(initial);
      })
      .catch(() => setError('Failed to load quiz'))
      .finally(() => setLoading(false));
  }, [id]);

  const doSubmit = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (submitted) return;
    setSubmitting(true);
    try {
      await api.submitQuiz(id, answers);
      const refreshed = await api.getQuiz(id);
      setQuiz(refreshed);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  }, [id, answers, submitted]);

  useEffect(() => {
    if (loading || submitted || error) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          doSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, submitted, error, doSubmit]);

  const handleSubmit = () => {
    const unanswered = Object.entries(answers).filter(([, v]) => !v);
    if (unanswered.length > 0) {
      Modal.confirm({
        title: 'Submit quiz?',
        content: `${unanswered.length} question(s) unanswered. Submit anyway?`,
        okText: 'Submit',
        cancelText: 'Review',
        onOk: doSubmit,
      });
    } else {
      doSubmit();
    }
  };

  const answered = Object.values(answers).filter(Boolean).length;
  const total = quiz?.questions?.length || 0;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  if (loading) return <QuizSkeleton />;

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <div
          style={{
            padding: '10px 14px',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            marginBottom: 16,
            fontSize: 13,
            display: 'inline-block',
          }}
        >
          {error}
        </div>
        <div>
          <Button onClick={() => window.location.reload()} type="default" style={{ fontWeight: 600, borderRadius: 0 }}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  if (submitted && quiz.score !== null) {
    return (
      <div>
        <QuizResult quiz={quiz} />
        {quiz.questions?.map((question, i) => (
          <div key={question.id} style={{ marginBottom: isMobile ? 16 : 14 }}>
            {isMobile ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 11, fontWeight: 700 }}>{i + 1}</Text>
                </div>
                <Text style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 600 }}>Question</Text>
              </div>
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 14, fontWeight: 700 }}>{i + 1}</Text>
              </div>
            )}
            <div
              style={{
                background: 'var(--color-surface)',
                borderRadius: 12,
                padding: isMobile ? 18 : 20,
                border: '1px solid var(--color-border)',
              }}
            >
              <QuizQuestionComponent
                question={question}
                selected={answers[question.id] || null}
                onSelect={() => {}}
                showResults
                isMobile={isMobile}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Timer + Progress header */}
      <div
        style={{
          marginBottom: 20,
          paddingBottom: isMobile ? 12 : 16,
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {isMobile ? (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '5px 10px',
                    borderRadius: 8,
                    background:
                      timeLeft < 60
                        ? 'rgba(239,68,68,0.1)'
                        : timeLeft < 180
                          ? 'rgba(234,179,8,0.1)'
                          : 'var(--color-surface)',
                    border: '1px solid',
                    borderColor:
                      timeLeft < 60
                        ? 'rgba(239,68,68,0.2)'
                        : timeLeft < 180
                          ? 'rgba(234,179,8,0.2)'
                          : 'var(--color-border)',
                  }}
                >
                  <ClockCircleOutlined
                    style={{
                      fontSize: 12,
                      color: timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#eab308' : 'var(--color-text-tertiary)',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#eab308' : 'var(--color-text)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatTime(timeLeft)}
                  </Text>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '5px 10px',
                    borderRadius: 8,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <CheckCircleFilled
                    style={{ fontSize: 12, color: answered === total ? '#22c55e' : 'var(--color-text-tertiary)' }}
                  />
                  <Text style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>
                    {answered}/{total}
                  </Text>
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--color-text-tertiary)',
                  textAlign: 'right',
                  lineHeight: 1.2,
                }}
              >
                {quiz.title || 'Quiz'}
              </div>
            </div>
            <Progress
              percent={pct}
              showInfo={false}
              strokeColor={answered === total ? '#22c55e' : '#6366f1'}
              trailColor="var(--color-border)"
              size="small"
            />
          </>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 8,
                    background:
                      timeLeft < 60
                        ? 'rgba(239,68,68,0.1)'
                        : timeLeft < 180
                          ? 'rgba(234,179,8,0.1)'
                          : 'var(--color-surface)',
                    border: '1px solid',
                    borderColor:
                      timeLeft < 60
                        ? 'rgba(239,68,68,0.2)'
                        : timeLeft < 180
                          ? 'rgba(234,179,8,0.2)'
                          : 'var(--color-border)',
                  }}
                >
                  <ClockCircleOutlined
                    style={{
                      fontSize: 13,
                      color: timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#eab308' : 'var(--color-text-tertiary)',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#eab308' : 'var(--color-text)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatTime(timeLeft)}
                  </Text>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <CheckCircleFilled
                    style={{ fontSize: 13, color: answered === total ? '#22c55e' : 'var(--color-text-tertiary)' }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>
                    {answered}/{total}
                  </Text>
                </div>
              </div>
              <div
                className="newspaper-heading"
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: 'var(--color-text)',
                }}
              >
                {quiz.title || 'Quiz'}
              </div>
            </div>
            <Progress
              percent={pct}
              showInfo={false}
              strokeColor={answered === total ? '#22c55e' : '#6366f1'}
              trailColor="var(--color-border)"
              size="small"
              style={{ marginTop: 16 }}
            />
          </>
        )}
      </div>

      {/* Questions */}
      {quiz.questions?.map((question, i) => (
        <div key={question.id} style={{ marginBottom: isMobile ? 16 : 14 }}>
          {isMobile ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 11, fontWeight: 700 }}>{i + 1}</Text>
              </div>
              <Text style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 600 }}>Question</Text>
            </div>
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 14, fontWeight: 700 }}>{i + 1}</Text>
            </div>
          )}
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 12,
              padding: isMobile ? 18 : 20,
              border: '1px solid var(--color-border)',
            }}
          >
            <QuizQuestionComponent
              question={question}
              selected={answers[question.id] || null}
              onSelect={(optionKey) => {
                if (submitted) return;
                setAnswers((prev) => ({ ...prev, [question.id]: optionKey }));
              }}
              showResults={false}
              isMobile={isMobile}
            />
          </div>
        </div>
      ))}

      {/* Submit */}
      <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 12 }}>
        <Button
          type="primary"
          size="large"
          loading={submitting}
          onClick={handleSubmit}
          style={{
            height: 48,
            padding: '0 40px',
            fontWeight: 700,
            fontSize: 14,
            borderRadius: 10,
            letterSpacing: '1px',
          }}
        >
          Submit Answers ({answered}/{total})
        </Button>
      </div>
    </div>
  );
}
