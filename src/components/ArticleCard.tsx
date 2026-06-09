'use client'

import { useState } from 'react'
import { Collapse, Tag, Typography, Button, message, Tooltip } from 'antd'
import { HeartOutlined, HeartFilled, LinkOutlined, DownOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import SyllabusTag from './SyllabusTag'
import FormattedSummary from './FormattedSummary'
import type { Article } from '@/lib/types'

const { Text } = Typography

export default function ArticleCard({ article }: { article: Article }) {
  const [bookmarked, setBookmarked] = useState(article.is_bookmarked ?? false)
  const [toggling, setToggling] = useState(false)
  const isLoggedIn = useAuthStore((s) => !!s.accessToken)

  const handleBookmark = async (e: React.MouseEvent) => {
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
    <Collapse
      ghost
      expandIconPosition="end"
      expandIcon={({ isActive }) => (
        <DownOutlined style={{ fontSize: 12, color: '#4a4a4a', transition: 'transform 0.2s', transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', marginRight: 4 }} />
      )}
      items={[
        {
          key: article.id,
          label: (
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              {article.image_url && (
                <div style={{ flexShrink: 0, width: 90, height: 68, borderRadius: 8, overflow: 'hidden', marginTop: 2, background: '#0f0f0f' }}>
                  <img
                    src={article.image_url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text strong style={{ fontSize: 15, color: '#ffffff', lineHeight: 1.4, display: 'block' }}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#ffffff', textDecoration: 'none' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {article.headline}
                  </a>
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, color: '#6b6b6b', fontSize: 12 }}>
                  <LinkOutlined style={{ fontSize: 11 }} />
                  <span>{new URL(article.url).hostname}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {article.syllabus_tag && <SyllabusTag tag={article.syllabus_tag} />}
                  {article.key_terms?.slice(0, 2).map((term) => (
                    <Tooltip key={term} title={term}>
                      <Tag style={{ fontSize: 10, borderRadius: 4, margin: 0, padding: '0 6px', background: '#141414', color: '#a1a1a1', border: '1px solid #1f1f1f', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{term}</Tag>
                    </Tooltip>
                  ))}
                  <Text style={{ color: '#6b6b6b', fontSize: 11 }}>
                    {article.source === 'thehindu' ? 'The Hindu' : 'Indian Express'} · {new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, flexShrink: 0, marginTop: 2 }}>
                <Button
                  type="text"
                  size="small"
                  loading={toggling}
                  onClick={handleBookmark}
                  icon={bookmarked ? (
                    <HeartFilled style={{ color: '#ef4444' }} />
                  ) : (
                    <HeartOutlined style={{ color: '#6b6b6b' }} />
                  )}
                  style={{ color: bookmarked ? '#ef4444' : '#6b6b6b' }}
                />
              </div>
            </div>
          ),
          children: article.gk_summary ? (
            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 16 }}>
              <FormattedSummary summary={article.gk_summary} />
            </div>
          ) : null,
        },
      ]}
      style={{
        marginBottom: 12,
        borderRadius: 12,
        background: '#111111',
        border: '1px solid #1f1f1f',
      }}
    />
  )
}
