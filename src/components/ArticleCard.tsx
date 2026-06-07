'use client'

import { useState } from 'react'
import { Card, Tag, Typography, Space, Button, message } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import SyllabusTag from './SyllabusTag'
import FormattedSummary from './FormattedSummary'
import type { Article } from '@/lib/types'

const { Text } = Typography

export default function ArticleCard({ article, defaultExpanded }: { article: Article; defaultExpanded?: string }) {
  const [bookmarked, setBookmarked] = useState(article.is_bookmarked ?? false)
  const [toggling, setToggling] = useState(false)
  const isLoggedIn = useAuthStore((s) => !!s.accessToken)

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) {
      message.info('Login to bookmark articles')
      return
    }
    setToggling(true)
    try {
      const res = await api.toggleBookmark(article.id)
      setBookmarked(res.bookmarked)
    } catch {
      message.error('Failed to toggle bookmark')
    } finally {
      setToggling(false)
    }
  }

  return (
    <Card
      className="article-card fade-in"
      styles={{
        body: { padding: 20 },
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <Text strong style={{ fontSize: 16, display: 'block', lineHeight: 1.45, color: '#1a1a1a', flex: 1 }}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1a73e8', textDecoration: 'none' }}
          >
            {article.headline}
          </a>
        </Text>
        <Button
          type="text"
          size="small"
          loading={toggling}
          onClick={handleBookmark}
          icon={bookmarked ? (
            <HeartFilled style={{ color: '#e53935', fontSize: 16 }} />
          ) : (
            <HeartOutlined style={{ color: '#bbb', fontSize: 16 }} />
          )}
          style={{ flexShrink: 0, marginTop: 2 }}
        />
      </div>

      {article.gk_summary && (
        <div style={{ marginTop: 10 }}>
          <FormattedSummary summary={article.gk_summary} compact={false} defaultExpanded={defaultExpanded} />
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14, alignItems: 'center' }}>
        {article.syllabus_tag && <SyllabusTag tag={article.syllabus_tag} />}
        {article.key_terms?.slice(0, 3).map((term) => (
          <Tag key={term} style={{ fontSize: 10, borderRadius: 4, margin: 0, lineHeight: '20px', padding: '0 6px' }}>
            {term}
          </Tag>
        ))}
        <Text style={{ color: '#aaa', fontSize: 11, marginLeft: 'auto' }}>
          {article.source === 'thehindu' ? 'The Hindu' : 'Indian Express'} · {new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      </div>
    </Card>
  )
}
