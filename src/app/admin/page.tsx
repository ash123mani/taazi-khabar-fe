'use client'

import { Typography, Row, Col, Card, Statistic } from 'antd'
import { DatabaseOutlined, BuildOutlined, RobotOutlined, FileTextOutlined, TagsOutlined, UsergroupAddOutlined, CalendarOutlined, ThunderboltOutlined, TrophyOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const { Title, Text } = Typography

const adminLinks = [
  {
    title: 'Training Data',
    description: 'Browse and manage AI interactions, provide feedback on responses',
    href: '/admin/training-data',
    icon: <DatabaseOutlined style={{ fontSize: 28 }} />,
    color: '#6366f1',
  },
  {
    title: 'Datasets',
    description: 'Build and manage training datasets from curated interactions',
    href: '/admin/datasets',
    icon: <BuildOutlined style={{ fontSize: 28 }} />,
    color: '#818cf8',
  },
  {
    title: 'Models',
    description: 'View model registry, swap active models, rollback versions',
    href: '/admin/models',
    icon: <RobotOutlined style={{ fontSize: 28 }} />,
    color: '#a855f7',
  },
  {
    title: 'Articles',
    description: 'Manage scraped articles and summaries',
    href: '/admin/articles',
    icon: <FileTextOutlined style={{ fontSize: 28 }} />,
    color: '#10b981',
  },
  {
    title: 'Categories',
    description: 'Organize articles with syllabus tags and categories',
    href: '/admin/categories',
    icon: <TagsOutlined style={{ fontSize: 28 }} />,
    color: '#f59e0b',
  },
  {
    title: 'Users',
    description: 'View and manage registered users',
    href: '/admin/users',
    icon: <UsergroupAddOutlined style={{ fontSize: 28 }} />,
    color: '#3b82f6',
  },
  {
    title: 'Scrape',
    description: 'Trigger article scraping from news sources',
    href: '/admin/scrape',
    icon: <CalendarOutlined style={{ fontSize: 28 }} />,
    color: '#ef4444',
  },
  {
    title: 'Summaries',
    description: 'Review and manage AI-generated summaries',
    href: '/admin/summaries',
    icon: <ThunderboltOutlined style={{ fontSize: 28 }} />,
    color: '#8b5cf6',
  },
]

export default function AdminDashboard() {
  const router = useRouter()

  return (
    <div>
      {/* Welcome Section */}
      <Card
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid #27272a',
          borderRadius: 16,
        }}
        styles={{ body: { padding: '28px 32px' } }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: '#fafafa', fontWeight: 700, letterSpacing: '-0.5px' }}>
              Admin Dashboard
            </Title>
            <Text style={{ color: '#a1a1aa', fontSize: 14, display: 'block', marginTop: 4 }}>
              Manage AI training data, datasets, and models
            </Text>
          </Col>
          <Col>
            <Statistic
              title={<Text style={{ color: '#a1a1aa', fontSize: 12 }}>Total Pages</Text>}
              value={adminLinks.length}
              prefix={<TrophyOutlined style={{ color: '#f59e0b' }} />}
              valueStyle={{ fontWeight: 700, color: '#fafafa' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Quick Actions Grid */}
      <Row gutter={[16, 16]}>
        {adminLinks.map((link) => (
          <Col xs={24} sm={12} md={8} lg={6} key={link.href}>
            <Card
              hoverable
              onClick={() => router.push(link.href)}
              style={{
                cursor: 'pointer',
                height: '100%',
                borderRadius: 14,
                border: '1px solid #27272a',
                background: '#141416',
                transition: 'all 0.3s ease',
              }}
              styles={{ body: { padding: '20px' } }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${link.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                color: link.color,
              }}>
                {link.icon}
              </div>
              <Title level={5} style={{ margin: 0, marginBottom: 6, color: '#fafafa', fontWeight: 600 }}>
                {link.title}
              </Title>
              <Text style={{ color: '#a1a1aa', fontSize: 12, lineHeight: 1.5, display: 'block' }}>
                {link.description}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
