'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Quiz } from '@/lib/types'

export function useHistory(params?: Record<string, string>) {
  return useQuery<Quiz[]>({
    queryKey: ['history', params],
    queryFn: () => api.getHistory(params),
  })
}

export function useHistoryDetail(id: string) {
  return useQuery<Quiz>({
    queryKey: ['history', id],
    queryFn: () => api.getHistoryDetail(id),
    enabled: !!id,
  })
}
