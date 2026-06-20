'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Article } from '@/lib/types'
import ArticleModal from './ArticleModal'

interface ArticleModalContextValue {
  openArticleModal: (article: Article) => void
  closeArticleModal: () => void
  selectedArticle: Article | null
}

export const ArticleModalContext = createContext<ArticleModalContextValue | null>(null)

export function ArticleModalProvider({ children }: { children: ReactNode }) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const openArticleModal = useCallback((article: Article) => {
    setSelectedArticle(article)
  }, [])

  const closeArticleModal = useCallback(() => {
    setSelectedArticle(null)
  }, [])

  return (
    <ArticleModalContext.Provider value={{ openArticleModal, closeArticleModal, selectedArticle }}>
      {children}
      <ArticleModal article={selectedArticle} onClose={closeArticleModal} />
    </ArticleModalContext.Provider>
  )
}

export function useArticleModal(): ArticleModalContextValue {
  const ctx = useContext(ArticleModalContext)
  if (!ctx) {
    throw new Error('useArticleModal must be used within ArticleModalProvider')
  }
  return ctx
}
