'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Layout, Menu, Typography, Spin, Avatar, Space, Dropdown, Tag } from 'antd'
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
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
            <div style={{ fontWeight: 600, fontSize: 14 }}>{session.user?.name || 'Admin User'}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{session.user?.email || ''}</div>
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

  const sidebarWidth = collapsed ? 64 : 240

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Sider
        width={240}
        collapsedWidth={64}
        collapsed={collapsed}
        style={{
          background: '#1a1a2e',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
          zIndex: 20,
          transition: 'all 0.2s',
          borderRight: 'none',
        }}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {collapsed ? (
            <Avatar size={28} icon={<UserOutlined />} style={{ background: '#4361ee' }} />
          ) : (
            <Space size={10}>
              <Avatar size={28} icon={<UserOutlined />} style={{ background: '#4361ee' }} />
              <div>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px', display: 'block', lineHeight: 1.2 }}>
                  Taazi Khabar
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, display: 'block', lineHeight: 1.2 }}>
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
          style={{
            background: 'transparent',
            borderRight: 'none',
            fontSize: 13,
            marginTop: 4,
          }}
          theme="dark"
        />

        {!collapsed && (
          <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center' }}>
            <Tag style={{ fontSize: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.3)' }}>
              v1.0.0
            </Tag>
          </div>
        )}
      </Sider>

      <Layout style={{ marginLeft: sidebarWidth, transition: 'margin-left 0.2s', minHeight: '100vh' }}>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            borderBottom: '1px solid #e8e8e8',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <Space
            style={{ cursor: 'pointer', color: '#888', fontSize: 16, padding: 4 }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Space>

          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer', padding: '2px 8px', borderRadius: 6, border: '1px solid #eee' }}>
              <Avatar size={26} icon={<UserOutlined />} style={{ background: '#4361ee' }} />
              <span style={{ color: '#555', fontSize: 13, fontWeight: 500 }}>
                {session.user?.name || session.user?.email?.split('@')[0] || 'Admin'}
              </span>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            padding: 24,
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 56px)',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 6,
              padding: 24,
              minHeight: 400,
              border: '1px solid #e8e8e8',
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
