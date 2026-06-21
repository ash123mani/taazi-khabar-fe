import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGenerateQuiz, useQuiz, useDailyQuizSummary, useStartDailyQuiz, useSubmitQuiz } from '@/hooks/useQuizzes';
import type { ReactNode } from 'react';

const mockGenerateQuiz = vi.fn();
const mockGetQuiz = vi.fn();
const mockGetDailyQuizSummary = vi.fn();
const mockStartDailyQuiz = vi.fn();
const mockSubmitQuiz = vi.fn();

vi.mock('@/lib/api', () => ({
  api: {
    generateQuiz: (...args: any[]) => mockGenerateQuiz(...args),
    getQuiz: (...args: any[]) => mockGetQuiz(...args),
    getDailyQuizSummary: (...args: any[]) => mockGetDailyQuizSummary(...args),
    startDailyQuiz: (...args: any[]) => mockStartDailyQuiz(...args),
    submitQuiz: (...args: any[]) => mockSubmitQuiz(...args),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches quiz by id', async () => {
    mockGetQuiz.mockResolvedValue({ id: 'q1', questions: [] });
    const { result } = renderHook(() => useQuiz('q1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 'q1', questions: [] });
  });

  it('is disabled when id is empty', () => {
    const { result } = renderHook(() => useQuiz(''), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useDailyQuizSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches daily summary', async () => {
    mockGetDailyQuizSummary.mockResolvedValue({
      date: '2026-06-15',
      categories: [],
      total_articles: 0,
      total_questions: 0,
    });
    const { result } = renderHook(() => useDailyQuizSummary(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ date: '2026-06-15', categories: [], total_articles: 0, total_questions: 0 });
  });

  it('passes date param', async () => {
    mockGetDailyQuizSummary.mockResolvedValue({ categories: [], total_articles: 0, total_questions: 0 });
    renderHook(() => useDailyQuizSummary('2026-06-15'), { wrapper: createWrapper() });
    await waitFor(() => {
      expect(mockGetDailyQuizSummary).toHaveBeenCalledWith('2026-06-15');
    });
  });
});

describe('useGenerateQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls api.generateQuiz on mutate', async () => {
    mockGenerateQuiz.mockResolvedValue({ quiz_id: 'q1', cached: false });
    const { result } = renderHook(() => useGenerateQuiz(), { wrapper: createWrapper() });
    result.current.mutate({ article_ids: ['a1', 'a2'], num_questions: 3 });
    await waitFor(() => expect(mockGenerateQuiz).toHaveBeenCalledWith(['a1', 'a2'], 3));
  });
});

describe('useStartDailyQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls api.startDailyQuiz on mutate', async () => {
    mockStartDailyQuiz.mockResolvedValue({ quiz_id: 'q1' });
    const { result } = renderHook(() => useStartDailyQuiz(), { wrapper: createWrapper() });
    result.current.mutate({ date: '2026-06-15', category_id: 'cat1' });
    await waitFor(() => expect(mockStartDailyQuiz).toHaveBeenCalledWith('2026-06-15', 'cat1'));
  });
});

describe('useSubmitQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls api.submitQuiz on mutate', async () => {
    mockSubmitQuiz.mockResolvedValue({ score: 5 });
    const { result } = renderHook(() => useSubmitQuiz(), { wrapper: createWrapper() });
    result.current.mutate({ id: 'q1', answers: { q1: 'A' } });
    await waitFor(() => expect(mockSubmitQuiz).toHaveBeenCalledWith('q1', { q1: 'A' }));
  });
});
