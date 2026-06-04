'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Typography, Space, Button, Spin } from 'antd'
import { ThunderboltOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'
import type { Article } from '@/lib/types'
import ArticleSelector from '@/components/ArticleSelector'

const { Title, Text } = Typography

export default function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselected = searchParams.get('selected')?.split(',').filter(Boolean) || []

  const [articles, setArticles] = useState<Article[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set(preselected))
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getArticles()
      .then((data) => setArticles(Array.isArray(data) ? data : data.articles || []))
      .catch(() => setError('Failed to load articles'))
      .finally(() => setLoading(false))
  }, [])

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const handleGenerate = async () => {
    if (selected.size === 0) return
    setGenerating(true)
    setError('')
    try {
      const data = await api.generateQuiz(Array.from(selected), 10)
      router.push(`/quiz/${data.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz')
      setGenerating(false)
    }
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 4, letterSpacing: '-0.5px' }}>Generate Quiz</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Select articles to generate a 10-question quiz
      </Text>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: 600 }}>
          {selected.size} article{selected.size !== 1 ? 's' : ''} selected
        </Text>
        {selected.size > 0 && (
          <Button type="link" size="small" onClick={() => setSelected(new Set())} style={{ fontWeight: 600 }}>
            Clear all
          </Button>
        )}
      </div>

      {error && (
        <div style={{ padding: 12, border: '1px solid var(--ant-color-error)', marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : (
        <ArticleSelector articles={articles} selected={selected} onToggle={toggleSelect} />
      )}

      {selected.size > 0 && (
        <div style={{ textAlign: 'center', marginTop: 32, marginBottom: 16 }}>
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            loading={generating}
            onClick={handleGenerate}
            style={{
              height: 50,
              padding: '0 40px',
              fontWeight: 700,
              fontSize: 15,
              borderRadius: 10,
            }}
          >
            Generate Quiz ({selected.size} articles)
          </Button>
        </div>
      )}
    </div>
  )
}
