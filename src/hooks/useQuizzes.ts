'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Quiz } from '@/lib/types'

export function useGenerateQuiz() {
  const queryClient = useQueryClient()
  return useMutation<Quiz, Error, { article_ids: string[]; num_questions: number }>({
    mutationFn: (data) => api.generateQuiz(data.article_ids, data.num_questions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] })
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })
}

export function useQuiz(id: string) {
  return useQuery<Quiz>({
    queryKey: ['quiz', id],
    queryFn: () => api.getQuiz(id),
    enabled: !!id,
  })
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient()
  return useMutation<any, Error, { id: string; answers: Record<string, string> }>({
    mutationFn: ({ id, answers }) => api.submitQuiz(id, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })
}
