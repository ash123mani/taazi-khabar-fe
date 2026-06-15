import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useArticles, useArticle } from '@/hooks/useArticles';
import type { ReactNode } from 'react';

const mockGetArticles = vi.fn();
const mockGetArticle = vi.fn();
vi.mock('@/lib/api', () => ({
  api: {
    getArticles: (...args: any[]) => mockGetArticles(...args),
    getArticle: (...args: any[]) => mockGetArticle(...args),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useArticles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches articles list', async () => {
    mockGetArticles.mockResolvedValue([{ id: 'a1', headline: 'Test' }]);
    const { result } = renderHook(() => useArticles(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: 'a1', headline: 'Test' }]);
  });

  it('passes params to api', async () => {
    mockGetArticles.mockResolvedValue([]);
    renderHook(() => useArticles({ source: 'thehindu', date: '2026-06-15' }), { wrapper: createWrapper() });
    await waitFor(() => expect(mockGetArticles).toHaveBeenCalledWith({ source: 'thehindu', date: '2026-06-15' }));
  });

  it('extracts articles from response with total', async () => {
    mockGetArticles.mockResolvedValue({ articles: [{ id: 'a1' }], total: 1 });
    const { result } = renderHook(() => useArticles(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data).toEqual([{ id: 'a1' }]));
  });

  it('uses correct query key', async () => {
    mockGetArticles.mockResolvedValue([]);
    renderHook(() => useArticles({ source: 'thehindu' }), { wrapper: createWrapper() });
    await waitFor(() => expect(mockGetArticles).toHaveBeenCalled());
  });
});

describe('useArticle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches single article', async () => {
    mockGetArticle.mockResolvedValue({ id: 'a1', headline: 'Test' });
    const { result } = renderHook(() => useArticle('a1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 'a1', headline: 'Test' });
  });

  it('is disabled when id is empty', async () => {
    const { result } = renderHook(() => useArticle(''), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});
