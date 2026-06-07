'use client'

import { Layout, Menu, Button, Space, Typography } from 'antd'
import {
  BookOutlined,
  QuestionCircleOutlined,
  HistoryOutlined,
  HeartOutlined,
  TrophyOutlined,
  LogoutOutlined,
  LoginOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const { Header, Content, Footer } = Layout
const { Text } = Typography

const publicMenuItems = [
  { key: '/', icon: <BookOutlined />, label: 'Articles' },
  { key: '/quiz', icon: <QuestionCircleOutlined />, label: 'Quiz' },
  { key: '/bookmarks', icon: <HeartOutlined />, label: 'Bookmarks' },
  { key: '/analytics', icon: <TrophyOutlined />, label: 'Analytics' },
  { key: '/history', icon: <HistoryOutlined />, label: 'History' },
]

function selectedKey(pathname: string): string {
  if (pathname === '/') return '/'
  if (pathname.startsWith('/quiz')) return '/quiz'
  if (pathname.startsWith('/bookmarks')) return '/bookmarks'
  if (pathname.startsWith('/analytics')) return '/analytics'
  if (pathname.startsWith('/history')) return '/history'
  return ''
}

export default function PublicLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  const isAdmin = (session?.user as any)?.is_admin

  const nav = [
    ...publicMenuItems,
    ...(isAdmin ? [{ key: '/admin' as const, icon: <ThunderboltOutlined />, label: 'Admin' }] : []),
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
          borderBottom: '1px solid #e8e8e8',
        }}
      >
        <Space
          size={8}
          style={{ cursor: 'pointer', flexShrink: 0 }}
          onClick={() => router.push('/')}
        >
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: -1,
          }}>
            TK
          </div>
          <Text strong style={{ fontSize: 16, letterSpacing: '-0.5px', color: '#1a1a1a' }}>
            Taazi Khabar
          </Text>
        </Space>

        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey(pathname)]}
          items={nav}
          onClick={({ key }) => router.push(key)}
          style={{
            flex: 1,
            minWidth: 0,
            maxWidth: 400,
            borderBottom: 'none',
            background: 'transparent',
            justifyContent: 'center',
            display: 'flex',
          }}
        />

        <Space style={{ flexShrink: 0 }}>
          {session ? (
            <Button type="text" icon={<LogoutOutlined />} onClick={() => signOut()} style={{ color: '#757575' }}>
              Logout
            </Button>
          ) : (
            <Button ghost icon={<LoginOutlined />} onClick={() => router.push('/login')}>
              Login
            </Button>
          )}
        </Space>
      </Header>

      <div style={{ height: 3, background: 'linear-gradient(90deg, #1a1a1a 0%, #555 50%, #1a1a1a 100%)', opacity: 0.8 }} />

      <Content
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 800,
          margin: '0 auto',
          padding: '28px 24px',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Content>

      <Footer
        style={{
          background: '#1a1a2e',
          padding: '20px 24px',
          textAlign: 'center',
        }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
          &copy; {new Date().getFullYear()} Taazi Khabar &mdash; AI-Powered UPSC Current Affairs
        </Text>
        <div style={{ marginTop: 4 }}>
          <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
            Built with Next.js, FastAPI &middot; NVIDIA NIM
          </Text>
        </div>
      </Footer>
    </Layout>
  )
}
