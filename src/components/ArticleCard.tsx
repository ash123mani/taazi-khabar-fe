'use client'

import { useState } from 'react'
import { Collapse, Tag, Typography, Button, message, Tooltip } from 'antd'
import { HeartOutlined, HeartFilled, DownOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useIsMobile } from '@/hooks/useIsMobile'
import SyllabusTag from './SyllabusTag'
import FormattedSummary from './FormattedSummary'
import type { Article } from '@/lib/types'

const { Text } = Typography

export default function ArticleCard({ article }: { article: Article }) {
  const [bookmarked, setBookmarked] = useState(article.is_bookmarked ?? false)
  const [toggling, setToggling] = useState(false)
  const isLoggedIn = useAuthStore((s) => !!s.accessToken)
  const isMobile = useIsMobile()

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
      size={isMobile ? 'small' : 'middle'}
      expandIconPosition="end"
      expandIcon={({ isActive }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 8 }}>
          <Button
            type="text"
            size="small"
            loading={toggling}
            onClick={handleBookmark}
            icon={bookmarked ? (
              <HeartFilled style={{ color: '#ef4444', fontSize: 13 }} />
            ) : (
              <HeartOutlined style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }} />
            )}
            style={{ color: bookmarked ? '#ef4444' : 'var(--color-text-tertiary)', width: 28, height: 28 }}
          />
          <DownOutlined style={{ fontSize: 11, color: '#4a4a4a', transition: 'transform 0.2s', transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </div>
      )}
      items={[
        {
          key: article.id,
          label: (
            <div style={{ display: 'flex', gap: isMobile ? 8 : 12, alignItems: 'flex-start' }}>
              {article.image_url && (
                <div style={{ flexShrink: 0, width: isMobile ? 72 : 90, height: isMobile ? 54 : 68, borderRadius: 8, overflow: 'hidden', background: 'var(--color-surface)' }}>
                  <img
                    src={article.image_url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text strong style={{ fontSize: isMobile ? 13 : 15, color: 'var(--color-text)', lineHeight: 1.4, display: 'block' }}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-text)', textDecoration: 'none' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {article.headline}
                  </a>
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4, color: 'var(--color-text-tertiary)', fontSize: isMobile ? 10 : 12 }}>
                  {!isMobile && article.syllabus_tag && <SyllabusTag tag={article.syllabus_tag} />}
                  {!isMobile && article.key_terms?.slice(0, 2).map((term) => (
                    <Tooltip key={term} title={term}>
                      <Tag style={{ fontSize: 9, borderRadius: 4, margin: 0, padding: '0 5px', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{term}</Tag>
                    </Tooltip>
                  ))}
                  <span style={{ marginLeft: 'auto', fontSize: isMobile ? 10 : 11 }}>
                    {dayjs(article.published_at).format('DD-MM-YYYY')}
                  </span>
                </div>
              </div>
            </div>
          ),
          children: article.gk_summary ? (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: isMobile ? 10 : 14 }}>
              <FormattedSummary summary={article.gk_summary} />
            </div>
          ) : null,
        },
      ]}
      styles={isMobile ? { header: { padding: '8px 10px' }, body: { padding: '4px 10px 10px' } } : undefined}
      style={{
        marginBottom: isMobile ? 8 : 10,
        borderRadius: isMobile ? 10 : 12,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    />
  )
}
