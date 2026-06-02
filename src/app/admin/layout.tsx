'use client'

import { ReactNode } from 'react'
import { Layout, Menu, Typography } from 'antd'
import {
  DashboardOutlined,
  DatabaseOutlined,
  BuildOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'

const { Sider, Content } = Layout
const { Title } = Typography

const menuItems = [
  { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/admin/training-data', icon: <DatabaseOutlined />, label: 'Training Data' },
  { key: '/admin/datasets', icon: <BuildOutlined />, label: 'Datasets' },
  { key: '/admin/models', icon: <RobotOutlined />, label: 'Models' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Layout style={{ minHeight: 400 }}>
      <Sider width={200} style={{ background: '#fff', borderRight: '2px solid #000' }}>
        <div style={{ padding: '16px 24px', borderBottom: '2px solid #000' }}>
          <Title level={5} style={{ margin: 0, letterSpacing: '-0.5px' }}>Admin</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{ borderRight: 'none' }}
        />
      </Sider>
      <Content style={{ padding: '0 24px' }}>
        {children}
      </Content>
    </Layout>
  )
}
