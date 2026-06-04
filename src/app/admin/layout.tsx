'use client'

import { ReactNode } from 'react'
import { Layout, Menu, Typography } from 'antd'
import {
  DashboardOutlined,
  DatabaseOutlined,
  BuildOutlined,
  RobotOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MenuUnfoldOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'

const { Sider, Content } = Layout
const { Title } = Typography

const menuItems = [
  { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/admin/scrape', icon: <CalendarOutlined />, label: 'Scrape' },
  { key: '/admin/summaries', icon: <FileTextOutlined />, label: 'Summaries' },
  { key: '/admin/articles', icon: <MenuUnfoldOutlined />, label: 'Articles' },
  { key: '/admin/categories', icon: <MenuUnfoldOutlined />, label: 'Categories' },
  { key: '/admin/users', icon: <UsergroupAddOutlined />, label: 'Users' },
  { key: '/admin/training-data', icon: <DatabaseOutlined />, label: 'Training Data' },
  { key: '/admin/datasets', icon: <BuildOutlined />, label: 'Datasets' },
  { key: '/admin/models', icon: <RobotOutlined />, label: 'Models' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Layout style={{ minHeight: 400 }}>
      <Sider width={200} style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ padding: '20px 24px 12px' }}>
          <Title level={5} style={{
            margin: 0,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Admin
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{ borderRight: 'none' }}
        />
      </Sider>
      <Content style={{ padding: '24px 32px' }}>
        {children}
      </Content>
    </Layout>
  )
}
