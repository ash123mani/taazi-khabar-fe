'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Quiz } from '@/lib/types'

export function useHistory(params?: Record<string, string>) {
  return useQuery<Quiz[]>({
    queryKey: ['history', 'list', params],
    queryFn: async () => {
      const data = await api.getHistory(params)
      return Array.isArray(data) ? data : (data as any).quizzes || []
    },
  })
}

export function useHistoryDetail(id: string) {
  return useQuery<Quiz>({
    queryKey: ['history', 'detail', id],
    queryFn: () => api.getHistoryDetail(id),
    enabled: !!id,
  })
}
