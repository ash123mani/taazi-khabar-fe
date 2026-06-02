'use client';

import { Suspense } from 'react';
import { Spin } from 'antd';
import QuizContent from './QuizContent';

export default function QuizPage() {
  return (
    <Suspense fallback={<Spin size="large" style={{ display: 'block', margin: '100px auto' }} />}>
      <QuizContent />
    </Suspense>
  );
}
