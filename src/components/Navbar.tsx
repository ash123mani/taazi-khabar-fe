'use client'

import { Layout, Menu, Button, Space, Typography } from 'antd'
import {
  BookOutlined,
  QuestionCircleOutlined,
  HistoryOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useUIStore } from '@/stores/uiStore'

const { Header } = Layout
const { Text } = Typography

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  const menuItems = [
    { key: '/', icon: <BookOutlined />, label: 'Articles' },
    { key: '/quiz', icon: <QuestionCircleOutlined />, label: 'Quiz' },
    { key: '/history', icon: <HistoryOutlined />, label: 'History' },
  ]

  if ((session?.user as any)?.is_admin) {
    menuItems.push({ key: '/admin', icon: <UserOutlined />, label: 'Admin' })
  }

  return (
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
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={toggleSidebar}
          style={{ fontSize: 16, opacity: 0.6 }}
        />
        <Text
          strong
          style={{
            fontSize: 18,
            cursor: 'pointer',
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          onClick={() => router.push('/')}
        >
          TAAZI KHABAR
        </Text>
      </div>

      <Menu
        mode="horizontal"
        selectedKeys={[pathname]}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{
          flex: 1,
          minWidth: 0,
          borderBottom: 'none',
          background: 'transparent',
          justifyContent: 'center',
        }}
      />

      <Space>
        {session ? (
          <Button type="text" icon={<LogoutOutlined />} onClick={() => signOut()} style={{ opacity: 0.7 }}>
            Logout
          </Button>
        ) : (
          <Button type="primary" ghost icon={<LoginOutlined />} onClick={() => router.push('/login')}>
            Login
          </Button>
        )}
      </Space>
    </Header>
  )
}
