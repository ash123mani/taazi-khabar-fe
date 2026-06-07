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
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 64,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Space
          size={10}
          style={{ cursor: 'pointer', flexShrink: 0 }}
          onClick={() => router.push('/')}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: -1,
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
          }}>
            TK
          </div>
          <Text strong style={{ fontSize: 17, letterSpacing: '-0.5px', color: '#0f172a', fontWeight: 700 }}>
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
            maxWidth: 480,
            borderBottom: 'none',
            background: 'transparent',
            justifyContent: 'center',
            display: 'flex',
          }}
        />

        <Space style={{ flexShrink: 0 }}>
          {session ? (
            <Button type="text" icon={<LogoutOutlined />} onClick={() => signOut()} style={{ color: '#64748b' }}>
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
        background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #4f46e5 100%)',
        opacity: 0.9,
      }} />

      <Content
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 860,
          margin: '0 auto',
          padding: '32px 24px',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Content>

      <Footer
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          padding: '24px',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>
          &copy; {new Date().getFullYear()} Taazi Khabar &mdash; AI-Powered UPSC Current Affairs
        </Text>
        <div style={{ marginTop: 4 }}>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
            Built with Next.js, FastAPI &middot; NVIDIA NIM
          </Text>
        </div>
      </Footer>
    </Layout>
  )
}
