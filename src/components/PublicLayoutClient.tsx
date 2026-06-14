'use client'

import { useState } from 'react'
import { Layout, Menu, Button, Space, Typography, Drawer } from 'antd'
import { useIsMobile } from '@/hooks/useIsMobile'
import {
  BookOutlined,
  QuestionCircleOutlined,
  HistoryOutlined,
  HeartOutlined,
  TrophyOutlined,
  LogoutOutlined,
  LoginOutlined,
  ThunderboltOutlined,
  SunOutlined,
  MoonOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useThemeStore } from '@/stores/themeStore'

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
  const isDark = useThemeStore((s) => s.isDark)
  const toggle = useThemeStore((s) => s.toggle)
  const isMobile = useIsMobile()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const isAdmin = (session?.user as any)?.is_admin

  const nav = [
    ...publicMenuItems,
    ...(isAdmin ? [{ key: '/admin' as const, icon: <ThunderboltOutlined />, label: 'Admin' }] : []),
  ]

  const handleNav = (key: string) => {
    router.push(key)
    setDrawerOpen(false)
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 12px' : '0 24px',
          height: 56,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--color-glass-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-glass-border)',
        }}
      >
        <Space
          size={8}
          style={{ cursor: 'pointer', flexShrink: 0 }}
          onClick={() => router.push('/')}
        >
          <div style={{
            width: isMobile ? 28 : 32,
            height: isMobile ? 28 : 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: isMobile ? 11 : 13,
            fontWeight: 800,
            letterSpacing: -1,
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
          }}>
            TK
          </div>
          {!isMobile && (
            <Text strong style={{ fontSize: 17, letterSpacing: '-0.5px', color: 'var(--color-text)', fontWeight: 700 }}>
              Taazi Khabar
            </Text>
          )}
        </Space>

        {isMobile ? (
          <div style={{ flex: 1 }} />
        ) : (
          <div style={{ flex: 1, overflow: 'hidden', margin: '0 16px' }}>
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey(pathname)]}
              items={nav}
              onClick={({ key }) => router.push(key)}
              style={{
                borderBottom: 'none',
                background: 'transparent',
                justifyContent: 'center',
                display: 'flex',
                minWidth: 0,
              }}
            />
          </div>
        )}

        <Space style={{ flexShrink: 0 }} size={isMobile ? 2 : 8}>
          <Button
            type="text"
            size={isMobile ? 'small' : 'middle'}
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggle}
            style={{ color: 'var(--color-text-secondary)' }}
          />
          {session ? (
            isMobile ? null : (
              <Button
                type="text"
                size="middle"
                icon={<LogoutOutlined />}
                onClick={() => signOut()}
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Logout
              </Button>
            )
          ) : (
            isMobile ? null : (
              <Button type="primary" ghost icon={<LoginOutlined />} onClick={() => router.push('/login')}>
                Login
              </Button>
            )
          )}
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 20 }} />}
              onClick={() => setDrawerOpen(true)}
              style={{ color: 'var(--color-text-secondary)' }}
            />
          )}
        </Space>
      </Header>

      <Drawer
        title={
          <Space>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 10, fontWeight: 800,
            }}>TK</div>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Taazi Khabar</span>
          </Space>
        }
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={260}
        styles={{ body: { padding: '8px 0' } }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[selectedKey(pathname)]}
          items={[
            ...nav,
            { type: 'divider' },
            ...(session
              ? [{ key: '__logout__', icon: <LogoutOutlined />, label: 'Logout', danger: true }]
              : [{ key: '/login', icon: <LoginOutlined />, label: 'Login' }]
            ),
          ]}
          onClick={({ key }) => {
            if (key === '__logout__') { signOut(); setDrawerOpen(false) }
            else handleNav(key)
          }}
          style={{ borderInlineEnd: 'none' }}
        />
      </Drawer>

      <Content
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 860,
          margin: '0 auto',
          padding: isMobile ? '16px 12px' : '32px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Content>

      <Footer
        style={{
          background: 'var(--gradient-footer)',
          padding: isMobile ? '16px 12px' : '24px',
          textAlign: 'center',
          borderTop: '1px solid var(--color-footer-border)',
        }}
      >
        <Text style={{ color: 'var(--color-text-tertiary)', fontSize: isMobile ? 11 : 13, fontWeight: 500 }}>
          &copy; {new Date().getFullYear()} Taazi Khabar
        </Text>
        {!isMobile && (
          <div style={{ marginTop: 4 }}>
            <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 12, opacity: 0.6 }}>
              Built with Next.js, FastAPI &middot; NVIDIA NIM
            </Text>
          </div>
        )}
      </Footer>
    </Layout>
  )
}
