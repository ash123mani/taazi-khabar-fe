import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInteractions, useBuildDataset, useModels, useUpdateModels } from '@/app/admin/_hooks/useAdmin';
import type { ReactNode } from 'react';

const mockGetInteractions = vi.fn();
const mockBuildDataset = vi.fn();
const mockGetModels = vi.fn();
const mockUpdateModels = vi.fn();

vi.mock('@/lib/api', () => ({
  api: {
    getInteractions: (...args: any[]) => mockGetInteractions(...args),
    buildDataset: (...args: any[]) => mockBuildDataset(...args),
    getModels: (...args: any[]) => mockGetModels(...args),
    updateModels: (...args: any[]) => mockUpdateModels(...args),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useInteractions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches interactions list', async () => {
    mockGetInteractions.mockResolvedValue([{ id: 'i1', persona: 'summarizer' }]);
    const { result } = renderHook(() => useInteractions(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: 'i1', persona: 'summarizer' }]);
  });

  it('extracts interactions from response', async () => {
    mockGetInteractions.mockResolvedValue({ interactions: [{ id: 'i1' }] });
    const { result } = renderHook(() => useInteractions(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data).toEqual([{ id: 'i1' }]));
  });
});

describe('useModels', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches models', async () => {
    mockGetModels.mockResolvedValue({ summarizer: ['model1'], question_setter: ['model2'] });
    const { result } = renderHook(() => useModels(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ summarizer: ['model1'], question_setter: ['model2'] });
  });
});

describe('useBuildDataset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls api.buildDataset on mutate', async () => {
    mockBuildDataset.mockResolvedValue({ id: 'ds1', name: 'Test' });
    const { result } = renderHook(() => useBuildDataset(), { wrapper: createWrapper() });
    result.current.mutate({ name: 'Test', persona: 'summarizer' });
    await waitFor(() => expect(mockBuildDataset).toHaveBeenCalledWith({ name: 'Test', persona: 'summarizer' }));
  });
});

describe('useUpdateModels', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls api.updateModels on mutate', async () => {
    mockUpdateModels.mockResolvedValue({ status: 'updated' });
    const { result } = renderHook(() => useUpdateModels(), { wrapper: createWrapper() });
    result.current.mutate({ summarizer: 'model1' });
    await waitFor(() => expect(mockUpdateModels).toHaveBeenCalledWith({ summarizer: 'model1' }));
  });
});
