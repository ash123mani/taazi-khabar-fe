'use client'

import { Layout, Menu, Button, Space, Typography } from 'antd'
import {
  BookOutlined,
  QuestionCircleOutlined,
  HistoryOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const { Header, Content, Footer } = Layout
const { Text } = Typography

const publicMenuItems = [
  { key: '/', icon: <BookOutlined />, label: 'Articles' },
  { key: '/quiz', icon: <QuestionCircleOutlined />, label: 'Quiz' },
  { key: '/history', icon: <HistoryOutlined />, label: 'History' },
]

function selectedKey(pathname: string): string {
  if (pathname === '/') return '/'
  if (pathname.startsWith('/quiz')) return '/quiz'
  if (pathname.startsWith('/history')) return '/history'
  return ''
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  const isAdmin = (session?.user as any)?.is_admin

  const nav = [
    ...publicMenuItems,
    ...(isAdmin ? [{ key: '/admin' as const, icon: <BookOutlined />, label: 'Admin' }] : []),
  ]

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 56,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <Text
          strong
          style={{ fontSize: 18, cursor: 'pointer', letterSpacing: '-0.5px', color: '#1a1a1a', flexShrink: 0 }}
          onClick={() => router.push('/')}
        >
          TAAZI KHABAR
        </Text>

        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey(pathname)]}
          items={nav}
          onClick={({ key }) => router.push(key)}
          style={{
            flex: 1,
            minWidth: 0,
            borderBottom: 'none',
            background: 'transparent',
            justifyContent: 'center',
          }}
        />

        <Space style={{ flexShrink: 0 }}>
          {session ? (
            <Button type="text" icon={<LogoutOutlined />} onClick={() => signOut()} style={{ color: '#757575' }}>
              Logout
            </Button>
          ) : (
            <Button type="primary" ghost icon={<LoginOutlined />} onClick={() => router.push('/login')}>
              Login
            </Button>
          )}
        </Space>
      </Header>

      <div style={{
        height: 3,
        background: 'linear-gradient(90deg, #4361ee, #7c3aed, #4361ee)',
      }} />

      <Content
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 1000,
          margin: '0 auto',
          padding: '28px 24px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 6,
            padding: 28,
            minHeight: 400,
            border: '1px solid #e8e8e8',
          }}
        >
          {children}
        </div>
      </Content>

      <Footer
        style={{
          background: '#1a1a2e',
          padding: '16px 24px',
          textAlign: 'center',
        }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
          &copy; 2026 Taazi Khabar &mdash; AI-Powered UPSC Current Affairs
        </Text>
      </Footer>
    </Layout>
  )
}
