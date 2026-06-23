import { authOptions } from './auth';
import { getServerSession } from 'next-auth';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE = rawUrl.replace(/\/+$/, '').replace(/\/api$/, '') + '/api';

export async function serverFetch<T = any>(path: string, options?: RequestInit): Promise<T> {
  const session = await getServerSession(authOptions);
  const token = (session as any)?.access_token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 0 },
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed with status ${res.status}`);
  }

  return res.json();
}
