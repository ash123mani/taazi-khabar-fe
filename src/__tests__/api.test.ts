import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/lib/api';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function ok(body: any) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);
}

function fail(status: number, body: string) {
  return Promise.resolve({ ok: false, status, text: () => Promise.resolve(body) } as Response);
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe('api', () => {
  it('register calls POST /auth/register', async () => {
    mockFetch.mockResolvedValueOnce(
      ok({ access_token: 't', user: { id: '1', email: 'a@b.com', name: 'A', is_admin: false } }),
    );
    const res = await api.register({ email: 'a@b.com', password: 'p', name: 'A' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(res.access_token).toBe('t');
  });

  it('login calls POST /auth/login', async () => {
    mockFetch.mockResolvedValueOnce(
      ok({ access_token: 't', user: { id: '1', email: 'a@b.com', name: 'A', is_admin: false } }),
    );
    const res = await api.login({ email: 'a@b.com', password: 'p' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(res.access_token).toBe('t');
  });

  it('getMe calls GET /auth/me', async () => {
    mockFetch.mockResolvedValueOnce(ok({ id: '1', email: 'a@b.com', name: 'A', is_admin: false }));
    const res = await api.getMe();
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/auth/me'), expect.any(Object));
    expect(res.email).toBe('a@b.com');
  });

  it('getArticles calls GET /articles with params', async () => {
    mockFetch.mockResolvedValueOnce(ok({ articles: [], total: 0 }));
    await api.getArticles({ source: 'thehindu' });
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/articles?source=thehindu'), expect.any(Object));
  });

  it('getArticle calls GET /articles/:id', async () => {
    mockFetch.mockResolvedValueOnce(ok({ id: '42', headline: 'Test' }));
    const res = await api.getArticle('42');
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/articles/42'), expect.any(Object));
    expect(res.headline).toBe('Test');
  });

  it('generateQuiz calls POST /quizzes/generate', async () => {
    mockFetch.mockResolvedValueOnce(ok({ quiz_id: 'q1', cached: false }));
    const res = await api.generateQuiz(['a1', 'a2'], 3);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/quizzes/generate'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(res.quiz_id).toBe('q1');
  });

  it('getQuiz calls GET /quizzes/:id', async () => {
    mockFetch.mockResolvedValueOnce(ok({ id: 'q1', questions: [] }));
    const res = await api.getQuiz('q1');
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/quizzes/q1'), expect.any(Object));
    expect(res.id).toBe('q1');
  });

  it('submitQuiz calls POST /quizzes/:id/submit', async () => {
    mockFetch.mockResolvedValueOnce(ok({ score: 2, total_questions: 2 }));
    const res = await api.submitQuiz('q1', { qid: 'B' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/quizzes/q1/submit'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(res.score).toBe(2);
  });

  it('getHistory calls GET /history with params', async () => {
    mockFetch.mockResolvedValueOnce(ok([]));
    await api.getHistory({ skip: '0', limit: '10' });
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/history?skip=0&limit=10'), expect.any(Object));
  });

  it('getHistoryDetail calls GET /history/:id', async () => {
    mockFetch.mockResolvedValueOnce(ok({ id: 'h1', score: null }));
    const res = await api.getHistoryDetail('h1');
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/history/h1'), expect.any(Object));
    expect(res.id).toBe('h1');
  });

  it('getModels calls GET /admin/models', async () => {
    mockFetch.mockResolvedValueOnce(ok({ summarizer: [], question_setter: [] }));
    const res = await api.getModels();
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/admin/models'), expect.any(Object));
    expect(res.summarizer).toEqual([]);
  });

  it('adminGetArticles calls GET /admin/articles with params', async () => {
    mockFetch.mockResolvedValueOnce(ok({ articles: [], total: 0 }));
    await api.adminGetArticles({ search: 'test', source: 'thehindu' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/articles?search=test&source=thehindu'),
      expect.any(Object),
    );
  });

  it('adminDeleteArticle calls DELETE /admin/articles/:id', async () => {
    mockFetch.mockResolvedValueOnce(ok({ status: 'deleted', id: 'a1' }));
    const res = await api.adminDeleteArticle('a1');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/articles/a1'),
      expect.objectContaining({ method: 'DELETE' }),
    );
    expect(res.status).toBe('deleted');
  });

  it('adminGetCategories calls GET /admin/categories with params', async () => {
    mockFetch.mockResolvedValueOnce(ok({ categories: [], total: 0 }));
    await api.adminGetCategories({ search: 'polity' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories?search=polity'),
      expect.any(Object),
    );
  });

  it('adminCreateCategory calls POST /admin/categories', async () => {
    mockFetch.mockResolvedValueOnce(ok({ status: 'created', id: 'c1', name: 'Polity', description: 'Indian Polity' }));
    const res = await api.adminCreateCategory({ name: 'Polity', description: 'Indian Polity' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(res.status).toBe('created');
    expect(res.id).toBe('c1');
  });

  it('adminUpdateCategory calls PUT /admin/categories/:id', async () => {
    mockFetch.mockResolvedValueOnce(
      ok({ status: 'updated', id: 'c1', name: 'Polity', description: 'Updated description' }),
    );
    const res = await api.adminUpdateCategory('c1', { name: 'Polity', description: 'Updated description' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories/c1'),
      expect.objectContaining({ method: 'PUT' }),
    );
    expect(res.status).toBe('updated');
  });

  it('adminDeleteCategory calls DELETE /admin/categories/:id', async () => {
    mockFetch.mockResolvedValueOnce(ok({ status: 'deleted', id: 'c1' }));
    const res = await api.adminDeleteCategory('c1');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories/c1'),
      expect.objectContaining({ method: 'DELETE' }),
    );
    expect(res.status).toBe('deleted');
  });

  it('adminGetUsers calls GET /admin/users with params', async () => {
    mockFetch.mockResolvedValueOnce(ok({ users: [], total: 0 }));
    await api.adminGetUsers({ search: 'admin' });
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/admin/users?search=admin'), expect.any(Object));
  });

  it('adminUpdateUserRole calls PUT /admin/users/:id/role', async () => {
    mockFetch.mockResolvedValueOnce(
      ok({ status: 'updated', id: 'u1', email: 'admin@example.com', name: 'Admin User', is_admin: true }),
    );
    const res = await api.adminUpdateUserRole('u1', { is_admin: true });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/users/u1/role'),
      expect.objectContaining({ method: 'PUT' }),
    );
    expect(res.status).toBe('updated');
    expect(res.is_admin).toBe(true);
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce(fail(401, 'Unauthorized'));
    await expect(api.getMe()).rejects.toThrow('Unauthorized');
  });
});
