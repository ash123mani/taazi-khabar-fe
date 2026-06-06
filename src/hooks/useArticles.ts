'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Article } from '@/lib/types'

export function useArticles(params?: Record<string, string>) {
  return useQuery<Article[]>({
    queryKey: ['articles', params],
    queryFn: async () => {
      const data = await api.getArticles(params)
      return Array.isArray(data) ? data : (data as any).articles || []
    },
  })
}

export function useArticle(id: string) {
  return useQuery<Article>({
    queryKey: ['article', id],
    queryFn: () => api.getArticle(id),
    enabled: !!id,
  })
}
