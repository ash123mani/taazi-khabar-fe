'use client'

import { useState } from 'react'
import { Input, Checkbox, Empty, Space } from 'antd'
import ArticleCard from './ArticleCard'
import type { Article } from '@/lib/types'

interface ArticleSelectorProps {
  articles: Article[]
  selected: Set<string>
  onToggle: (id: string) => void
}

export default function ArticleSelector({ articles, selected, onToggle }: ArticleSelectorProps) {
  const [search, setSearch] = useState('')

  const filtered = articles.filter(
    (a) =>
      a.headline.toLowerCase().includes(search.toLowerCase()) ||
      (a.gk_summary || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <Input.Search
        placeholder="Search articles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        size="large"
      />
      {filtered.map((article) => (
        <div key={article.id} style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, opacity: 0.7 }}>
            <Checkbox
              checked={selected.has(article.id)}
              onChange={() => onToggle(article.id)}
            >
              Select
            </Checkbox>
          </div>
          <ArticleCard article={article} />
        </div>
      ))}
      {filtered.length === 0 && (
        <Empty
          description="No articles found"
        />
      )}
    </Space>
  )
}
