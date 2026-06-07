'use client'

import { useState } from 'react'
import { Card, Tag, Typography, Space, Button, message } from 'antd'
import { HeartOutlined, HeartFilled, LinkOutlined } from '@ant-design/icons'
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
      style={{ borderRadius: 12, marginBottom: 16, transition: 'all 0.2s ease', background: '#141416', border: '1px solid #27272a' }}
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text strong style={{ fontSize: 15, color: '#fafafa', lineHeight: 1.4, display: 'block' }}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fafafa', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#fafafa'}
              >
                {article.headline}
              </a>
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, color: '#d4d4d8', fontSize: 12 }}>
              <LinkOutlined style={{ fontSize: 11 }} />
              <span>{new URL(article.url).hostname}</span>
            </div>
          </div>
          <Button
            type="text"
            size="small"
            loading={toggling}
            onClick={handleBookmark}
            icon={bookmarked ? (
              <HeartFilled style={{ color: '#ef4444' }} />
            ) : (
              <HeartOutlined style={{ color: '#a1a1aa' }} />
            )}
            style={{ color: bookmarked ? '#ef4444' : '#a1a1aa' }}
          />
        </div>

        {article.gk_summary && (
          <div style={{ marginTop: 12 }}>
            <FormattedSummary summary={article.gk_summary} compact={false} defaultExpanded={defaultExpanded} />
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {article.syllabus_tag && <SyllabusTag tag={article.syllabus_tag} />}
          {article.key_terms?.slice(0, 3).map((term) => (
            <Tag key={term} style={{ fontSize: 11, borderRadius: 4, margin: 0, background: '#27272a', color: '#a1a1aa', border: '1px solid #3f3f46' }}>{term}</Tag>
          ))}
          <Text style={{ color: '#a1a1aa', fontSize: 12, marginLeft: 'auto' }}>
            {article.source === 'thehindu' ? 'The Hindu' : 'Indian Express'} · {new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </div>
      </div>
    </Card>
  )
}
