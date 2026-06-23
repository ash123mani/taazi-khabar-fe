import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHistory, useHistoryDetail } from '@/app/(public)/_hooks/useHistory';
import type { ReactNode } from 'react';

const mockGetHistory = vi.fn();
const mockGetHistoryDetail = vi.fn();
vi.mock('@/lib/api', () => ({
  api: {
    getHistory: (...args: any[]) => mockGetHistory(...args),
    getHistoryDetail: (...args: any[]) => mockGetHistoryDetail(...args),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches history list', async () => {
    mockGetHistory.mockResolvedValue([{ id: 'h1', score: 8 }]);
    const { result } = renderHook(() => useHistory(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: 'h1', score: 8 }]);
  });

  it('extracts quizzes from response', async () => {
    mockGetHistory.mockResolvedValue({ quizzes: [{ id: 'h1' }], total: 1 });
    const { result } = renderHook(() => useHistory(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data).toEqual([{ id: 'h1' }]));
  });

  it('passes params', async () => {
    mockGetHistory.mockResolvedValue([]);
    renderHook(() => useHistory({ skip: '0', limit: '10' }), { wrapper: createWrapper() });
    await waitFor(() => expect(mockGetHistory).toHaveBeenCalledWith({ skip: '0', limit: '10' }));
  });
});

describe('useHistoryDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches history detail', async () => {
    mockGetHistoryDetail.mockResolvedValue({ id: 'h1', score: 8 });
    const { result } = renderHook(() => useHistoryDetail('h1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 'h1', score: 8 });
  });

  it('is disabled when id is empty', async () => {
    const { result } = renderHook(() => useHistoryDetail(''), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});
