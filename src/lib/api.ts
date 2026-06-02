const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchApi(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  register: (data: { email: string; password: string; name: string }) =>
    fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getMe: () => fetchApi('/auth/me'),

  getArticles: (params?: Record<string, string>) =>
    fetchApi(`/articles?${new URLSearchParams(params)}`),

  getArticle: (id: string) => fetchApi(`/articles/${id}`),

  generateQuiz: (article_ids: string[], num_questions: number) =>
    fetchApi('/quizzes/generate', {
      method: 'POST',
      body: JSON.stringify({ article_ids, num_questions }),
    }),

  getQuiz: (id: string) => fetchApi(`/quizzes/${id}`),

  submitQuiz: (id: string, answers: Record<string, string>) =>
    fetchApi(`/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  getHistory: (params?: Record<string, string>) =>
    fetchApi(`/history?${new URLSearchParams(params)}`),

  getHistoryDetail: (id: string) => fetchApi(`/history/${id}`),

  getInteractions: (params?: Record<string, string>) =>
    fetchApi(`/admin/interactions?${new URLSearchParams(params)}`),

  updateInteraction: (id: string, data: any) =>
    fetchApi(`/admin/interactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  buildDataset: (data: any) =>
    fetchApi('/admin/datasets', { method: 'POST', body: JSON.stringify(data) }),

  getModels: () => fetchApi('/admin/models'),

  updateModels: (data: any) =>
    fetchApi('/admin/models', { method: 'PUT', body: JSON.stringify(data) }),
};
