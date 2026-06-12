import { useAuthStore } from '@/stores/authStore'

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE = rawUrl.replace(/\/+$/, '').replace(/\/api$/, '') + '/api';

async function fetchApi(path: string, options?: RequestInit) {
  const token = useAuthStore.getState().accessToken
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
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
    fetchApi(`/articles${params ? `?${new URLSearchParams(params)}` : ''}`),

  getArticleCounts: (params?: Record<string, string>) =>
    fetchApi(`/articles/counts${params ? `?${new URLSearchParams(params)}` : ''}`),

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
    fetchApi(`/history${params ? `?${new URLSearchParams(params)}` : ''}`),

  getHistoryDetail: (id: string) => fetchApi(`/history/${id}`),

  getInteractions: (params?: Record<string, string>) =>
    fetchApi(`/admin/interactions${params ? `?${new URLSearchParams(params)}` : ''}`),

  updateInteraction: (id: string, data: any) =>
    fetchApi(`/admin/interactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getDatasets: (params?: Record<string, string>) =>
    fetchApi(`/admin/datasets${params ? `?${new URLSearchParams(params)}` : ''}`),

  getTrainingDatasets: (params?: Record<string, string>) =>
    fetchApi(`/admin/datasets${params ? `?${new URLSearchParams(params)}` : ''}`),

  deleteTrainingDataset: (id: string) =>
    fetchApi(`/admin/datasets/${id}`, { method: 'DELETE' }),

  buildDataset: (data: any) =>
    fetchApi('/admin/datasets', { method: 'POST', body: JSON.stringify(data) }),

  downloadDataset: async (id: string) => {
    const token = useAuthStore.getState().accessToken
    const res = await fetch(`${API_BASE}/admin/datasets/${id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) throw new Error(`Download failed: ${res.statusText}`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = res.headers.get('content-disposition')?.split('filename="')?.[1]?.split('"')?.[0] || 'dataset.jsonl'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  getModels: () => fetchApi('/admin/models'),

  deleteModel: (id: string) =>
    fetchApi(`/admin/models/${id}`, { method: 'DELETE' }),

  updateModels: (data: any) =>
    fetchApi('/admin/models', { method: 'PUT', body: JSON.stringify(data) }),

  getScrapeDates: (days?: number) =>
    fetchApi(`/admin/scrape-dates${days ? `?days=${days}` : ''}`),
  getScrapeSummary: (days?: number) =>
    fetchApi(`/admin/scrape-summary${days ? `?days=${days}` : ''}`),
  getScrapeArticles: (source: string, date: string) =>
    fetchApi(`/admin/scrape-articles?source=${encodeURIComponent(source)}&date=${encodeURIComponent(date)}`),
  scrapeDate: (source: string, date: string) =>
    fetchApi('/admin/scrape-date', {
      method: 'POST',
      body: JSON.stringify({ source, date }),
    }),

  getArticlesWithoutSummary: (skip?: number, limit?: number) =>
    fetchApi(`/admin/articles-without-summary?skip=${skip || 0}&limit=${limit || 50}`),

  generateSummaries: (article_ids: string[]) =>
    fetchApi('/admin/generate-summaries', {
      method: 'POST',
      body: JSON.stringify({ article_ids }),
    }),

  adminGetArticles: (params?: Record<string, string>) =>
    fetchApi(`/admin/articles${params ? `?${new URLSearchParams(params)}` : ''}`),

  adminDeleteArticle: (id: string) =>
    fetchApi(`/admin/articles/${id}`, { method: 'DELETE' }),

  deleteArticle: (id: string) =>
    fetchApi(`/articles/${id}`, { method: 'DELETE' }),

  adminGetCategories: (params?: Record<string, string>) =>
    fetchApi(`/admin/categories${params ? `?${new URLSearchParams(params)}` : ''}`),

  adminCreateCategory: (data: any) =>
    fetchApi('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  adminUpdateCategory: (id: string, data: any) =>
    fetchApi(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  adminDeleteCategory: (id: string) =>
    fetchApi(`/admin/categories/${id}`, { method: 'DELETE' }),

  deleteCategory: (id: string) =>
    fetchApi(`/categories/${id}`, { method: 'DELETE' }),

  getCategories: (params?: Record<string, string>) =>
    fetchApi(`/categories${params ? `?${new URLSearchParams(params)}` : ''}`),

  adminGetUsers: (params?: Record<string, string>) =>
    fetchApi(`/admin/users${params ? `?${new URLSearchParams(params)}` : ''}`),

  adminUpdateUserRole: (id: string, data: any) =>
    fetchApi(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getBookmarkedIds: () => fetchApi('/bookmarks'),

  getBookmarkedArticles: () => fetchApi('/bookmarks/articles'),

  toggleBookmark: (articleId: string) =>
    fetchApi(`/bookmarks/${articleId}`, { method: 'POST' }),

  getDailyQuizSummary: (date?: string) =>
    fetchApi(`/quizzes/by-date${date ? `?date_str=${date}` : ''}`),

  startDailyQuiz: (date: string, category_id?: string) =>
    fetchApi('/quizzes/daily-start', {
      method: 'POST',
      body: JSON.stringify({ date, category_id: category_id || null }),
    }),

  getPerformance: () => fetchApi('/analytics/performance'),

  getAnalytics: () => fetchApi('/analytics'),
};
