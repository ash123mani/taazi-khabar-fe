'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AIInteraction, TrainingDataset } from '@/lib/types'

export function useInteractions(params?: Record<string, string>) {
  return useQuery<AIInteraction[]>({
    queryKey: ['interactions', params],
    queryFn: async () => {
      const data = await api.getInteractions(params)
      return Array.isArray(data) ? data : (data as any).interactions || []
    },
  })
}

export function useBuildDataset() {
  const queryClient = useQueryClient()
  return useMutation<TrainingDataset, Error, any>({
    mutationFn: (data) => api.buildDataset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] })
    },
  })
}

export function useModels() {
  return useQuery<Record<string, any>>({
    queryKey: ['models'],
    queryFn: () => api.getModels(),
  })
}

export function useUpdateModels() {
  const queryClient = useQueryClient()
  return useMutation<any, Error, any>({
    mutationFn: (data) => api.updateModels(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] })
    },
  })
}
