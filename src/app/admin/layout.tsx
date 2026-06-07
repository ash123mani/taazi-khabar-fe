'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Layout, Menu, Typography, Spin, Avatar, Space, Dropdown, Tag, Button, Card, Row, Col, Statistic } from 'antd'
import type { MenuProps } from 'antd'
import {
  BarChartOutlined,
  CalendarOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  TagsOutlined,
  UsergroupAddOutlined,
  DatabaseOutlined,
  BuildOutlined,
  RobotOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const { Sider, Content, Header } = Layout
const { Text } = Typography

const menuItems: MenuProps['items'] = [
  { key: '/admin', icon: <BarChartOutlined />, label: 'Dashboard' },
  { key: '/admin/scrape', icon: <CalendarOutlined />, label: 'Scrape' },
  { key: '/admin/summaries', icon: <FileTextOutlined />, label: 'Summaries' },
  { key: '/admin/articles', icon: <OrderedListOutlined />, label: 'Articles' },
  { key: '/admin/categories', icon: <TagsOutlined />, label: 'Categories' },
  { key: '/admin/users', icon: <UsergroupAddOutlined />, label: 'Users' },
  { type: 'divider', key: 'sep1' },
  { key: '/admin/training-data', icon: <DatabaseOutlined />, label: 'Training Data' },
  { key: '/admin/datasets', icon: <BuildOutlined />, label: 'Datasets' },
  { key: '/admin/models', icon: <RobotOutlined />, label: 'Models' },
]

const routeKeys = menuItems.filter((m) => m && 'key' in m && typeof (m as any).key === 'string').map((m) => (m as any).key as string)

function getSelectedKey(pathname: string): string {
  if (pathname === '/admin') return '/admin'
  const match = routeKeys.find((k) => k !== '/admin' && pathname.startsWith(k))
  return match || '/admin'
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0b' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userMenu = {
    items: [
      {
        key: 'info',
        label: (
          <div style={{ padding: '4px 0' }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#fafafa' }}>{session.user?.name || 'Admin User'}</div>
            <div style={{ fontSize: 12, color: '#a1a1aa' }}>{session.user?.email || ''}</div>
          </div>
        ),
        disabled: true,
      },
      { type: 'divider' as const },
      {
        key: 'home',
        icon: <HomeOutlined />,
        label: 'Visit Site',
      },
      { type: 'divider' as const },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Sign Out', danger: true },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') signOut({ callbackUrl: '/login' })
      if (key === 'home') router.push('/')
    },
  }

  const sidebarWidth = collapsed ? 80 : 240

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={240}
        collapsedWidth={80}
        collapsed={collapsed}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
          zIndex: 20,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid #27272a',
          }}
        >
          {collapsed ? (
            <Avatar size={36} icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }} />
          ) : (
            <Space size={12}>
              <Avatar size={36} icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }} />
              <div>
                <Text style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px', display: 'block', lineHeight: 1.2, color: '#fafafa' }}>
                  Taazi Khabar
                </Text>
                <Text style={{ fontSize: 11, display: 'block', lineHeight: 1.2, fontWeight: 500, color: '#a1a1aa' }}>
                  Admin Panel
                </Text>
              </div>
            </Space>
          )}
        </div>

        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[getSelectedKey(pathname)]}
          items={menuItems}
          onClick={({ key }) => {
            if (key !== 'sep1') router.push(key)
          }}
          style={{ borderRight: 'none', fontSize: 13, marginTop: 8, padding: '0 8px' }}
          theme="dark"
        />

        {!collapsed && (
          <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center' }}>
            <Tag style={{ fontSize: 10, borderRadius: 6, padding: '2px 8px', background: '#27272a', color: '#a1a1aa', border: '1px solid #3f3f46' }}>
              v1.0.0
            </Tag>
          </div>
        )}
      </Sider>

      <Layout style={{ marginLeft: sidebarWidth, transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', minHeight: '100vh', background: '#0a0a0b' }}>
        <Header
          style={{
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: '#141416',
            borderBottom: '1px solid #27272a',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 40, height: 40, borderRadius: 8, color: '#d4d4d8' }}
          />

          <Dropdown menu={userMenu} placement="bottomRight">
            <Space
              style={{ cursor: 'pointer', padding: '6px 12px', borderRadius: 10, transition: 'all 0.2s ease', background: '#1c1c1f' }}
            >
              <Avatar size={28} icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: '#fafafa' }}>
                {session.user?.name || session.user?.email?.split('@')[0] || 'Admin'}
              </span>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{ padding: 24, minHeight: 'calc(100vh - 64px)' }}
        >
          <div style={{ borderRadius: 16, minHeight: 400 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
