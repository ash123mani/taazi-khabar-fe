'use client'

import { Card, Tag, Typography, Space } from 'antd'
import SyllabusTag from './SyllabusTag'
import FormattedSummary from './FormattedSummary'
import type { Article } from '@/lib/types'

const { Text } = Typography

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Card
      className="article-card fade-in"
      styles={{
        body: { padding: 24, position: 'relative', zIndex: 1 },
      }}
    >
      {article.image_url && (
        <div
          className="card-bg"
          style={{ backgroundImage: `url(${article.image_url})` }}
        />
      )}
      <div className="card-content" style={{ marginBottom: 12 }}>
        <Text strong style={{ fontSize: 16, display: 'block', lineHeight: 1.4 }}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#1a1a1a',
              textDecoration: 'none',
            }}
          >
            {article.headline}
          </a>
        </Text>
        {article.gk_summary && (
          <div style={{
            fontSize: 14,
            marginTop: 10,
            lineHeight: 1.7,
            color: '#424242',
          }}>
            <FormattedSummary summary={article.gk_summary} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <Space wrap size={4}>
          {article.syllabus_tag && <SyllabusTag tag={article.syllabus_tag} />}
          {article.key_terms?.slice(0, 3).map((term) => (
            <Tag key={term} style={{ fontSize: 11 }}>
              {term}
            </Tag>
          ))}
        </Space>
        <Text style={{ color: '#9e9e9e', fontSize: 12 }}>
          {article.source} · {new Date(article.published_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </Text>
      </div>
    </Card>
  )
}
