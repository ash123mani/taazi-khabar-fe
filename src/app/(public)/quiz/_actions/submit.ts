'use server';

import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE = rawUrl.replace(/\/+$/, '').replace(/\/api$/, '') + '/api';

export async function submitQuiz(formData: FormData) {
  const id = formData.get('id') as string;
  const answersRaw = formData.get('answers') as string;
  const answers = JSON.parse(answersRaw);

  const session = await getServerSession(authOptions);
  const token = (session as any)?.access_token;

  const res = await fetch(`${API_BASE}/quizzes/${id}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ answers }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || 'Failed to submit quiz');
  }

  return res.json();
}

export async function getQuizData(id: string) {
  const session = await getServerSession(authOptions);
  const token = (session as any)?.access_token;

  const res = await fetch(`${API_BASE}/quizzes/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || 'Failed to fetch quiz');
  }

  return res.json();
}
