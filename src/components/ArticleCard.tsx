'use client'

import { Card, Tag, Typography, Space } from 'antd'
import SyllabusTag from './SyllabusTag'
import type { Article } from '@/lib/types'

const { Text, Paragraph } = Typography

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Card
      style={{
        border: '2px solid #000',
        borderRadius: 0,
        boxShadow: 'none',
      }}
      styles={{
        body: { padding: 20 },
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ fontSize: 16, display: 'block', lineHeight: 1.3 }}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#000', textDecoration: 'none' }}
          >
            {article.headline}
          </a>
        </Text>
        {article.gk_summary && (
          <Paragraph
            style={{
              color: '#666',
              fontSize: 14,
              marginTop: 8,
              marginBottom: 0,
              lineHeight: 1.6,
            }}
            ellipsis={{ rows: 3 }}
          >
            {article.gk_summary}
          </Paragraph>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space wrap size={4}>
          {article.syllabus_tag && <SyllabusTag tag={article.syllabus_tag} />}
          {article.key_terms?.slice(0, 3).map((term) => (
            <Tag key={term} style={{ border: '1px solid #000', background: '#fff', color: '#666', fontSize: 11 }}>
              {term}
            </Tag>
          ))}
        </Space>
        <Text style={{ color: '#999', fontSize: 12 }}>
          {article.source} · {new Date(article.published_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </Text>
      </div>
    </Card>
  )
}
