'use client'

import { Typography, Row, Col } from 'antd'
import { DatabaseOutlined, BuildOutlined, RobotOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const { Title, Text } = Typography

const adminLinks = [
  {
    title: 'Training Data',
    description: 'Browse and manage AI interactions, provide feedback on responses',
    href: '/admin/training-data',
    icon: <DatabaseOutlined style={{ fontSize: 28 }} />,
  },
  {
    title: 'Datasets',
    description: 'Build and manage training datasets from curated interactions',
    href: '/admin/datasets',
    icon: <BuildOutlined style={{ fontSize: 28 }} />,
  },
  {
    title: 'Models',
    description: 'View model registry, swap active models, rollback versions',
    href: '/admin/models',
    icon: <RobotOutlined style={{ fontSize: 28 }} />,
  },
]

export default function AdminDashboard() {
  const router = useRouter()

  return (
    <div>
      <Title level={4} style={{ marginBottom: 4, letterSpacing: '-0.5px' }}>Admin Dashboard</Title>
      <Text style={{ color: '#666', display: 'block', marginBottom: 24 }}>
        Manage AI training data, datasets, and models
      </Text>

      <Row gutter={[16, 16]}>
        {adminLinks.map((link) => (
          <Col xs={24} sm={12} md={8} key={link.href}>
            <div
              onClick={() => router.push(link.href)}
              style={{
                border: '2px solid #000',
                padding: 24,
                background: '#fff',
                cursor: 'pointer',
                height: '100%',
              }}
            >
              <div style={{ marginBottom: 16 }}>{link.icon}</div>
              <Title level={5} style={{ margin: 0, marginBottom: 8 }}>{link.title}</Title>
              <Text style={{ color: '#666', fontSize: 13 }}>{link.description}</Text>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  )
}
