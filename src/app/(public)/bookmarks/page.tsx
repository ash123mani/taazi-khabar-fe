'use client'

import { useEffect, useState } from 'react'
import { Typography, Spin, Button } from 'antd'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import ArticleCard from '@/components/ArticleCard'
import { useIsMobile } from '@/hooks/useIsMobile'

const { Text } = Typography

export default function BookmarksPage() {
  const token = useAuthStore((s) => s.accessToken)
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()

  const fetchBookmarks = async () => {
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const data = await api.getBookmarkedArticles()
      setArticles(data)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookmarks()
  }, [token])

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div className="newspaper-heading" style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
          Please login to view bookmarks
        </div>
        <Button type="primary" href="/login" style={{ fontWeight: 600, borderRadius: 2, letterSpacing: '0.5px', fontSize: 12, height: 36, padding: '0 24px' }}>
          Login
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <div style={{
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: isMobile ? 8 : 12,
        marginBottom: isMobile ? 10 : 14,
      }}>
        <div className="newspaper-heading" style={{
          fontWeight: 800,
          fontSize: isMobile ? 20 : 26,
          letterSpacing: '-0.3px',
          color: 'var(--color-text)',
          lineHeight: 1.15,
        }}>
          Clippings
        </div>
      </div>
      {articles.length === 0 ? (
        <div style={{ padding: isMobile ? '32px 12px' : '48px 16px', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
          <div className="newspaper-heading" style={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            No bookmarks yet
          </div>
          <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 12, display: 'block', marginBottom: 16 }}>
            Start reading and bookmark articles to save them here
          </Text>
          <Link href="/">
            <Button type="primary" style={{ fontWeight: 600, borderRadius: 2, letterSpacing: '0.5px', fontSize: 12, height: 36, padding: '0 24px' }}>
              Browse Articles
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: isMobile ? 4 : 8,
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <Text style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)',
              whiteSpace: 'nowrap',
            }}>
              {articles.length} Saved Article{articles.length !== 1 ? 's' : ''}
            </Text>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {articles.map((article) => (
              <div key={article.id} style={{
                borderBottom: '1px solid var(--color-border)',
                padding: isMobile ? '8px 0' : '12px 0',
              }}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
