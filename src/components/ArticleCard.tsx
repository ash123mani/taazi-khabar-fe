'use client'

import { Card, Tag, Typography, Space } from 'antd'
import ReactMarkdown from 'react-markdown'
import SyllabusTag from './SyllabusTag'
import type { Article } from '@/lib/types'

const { Text } = Typography

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Card
      className="glass-card fade-in"
      styles={{
        body: { padding: 20 },
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ fontSize: 16, display: 'block', lineHeight: 1.35 }}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
          >
            {article.headline}
          </a>
        </Text>
        {article.gk_summary && (
          <div style={{
            fontSize: 14,
            marginTop: 10,
            marginBottom: 0,
            lineHeight: 1.65,
            opacity: 0.85,
          }}>
            <ReactMarkdown
              components={{
                strong: ({ children }) => <strong>{children}</strong>,
                ul: ({ children }) => <ul style={{ paddingLeft: 20, margin: '4px 0' }}>{children}</ul>,
                li: ({ children }) => <li style={{ marginBottom: 2 }}>{children}</li>,
                h3: ({ children }) => <h3 style={{ fontSize: 15, margin: '8px 0 4px', fontWeight: 600 }}>{children}</h3>,
              }}
            >
              {article.gk_summary}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space wrap size={4}>
          {article.syllabus_tag && <SyllabusTag tag={article.syllabus_tag} />}
          {article.key_terms?.slice(0, 3).map((term) => (
            <Tag key={term} style={{ fontSize: 11 }}>
              {term}
            </Tag>
          ))}
        </Space>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {article.source} · {new Date(article.published_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </Text>
      </div>
    </Card>
  )
}
