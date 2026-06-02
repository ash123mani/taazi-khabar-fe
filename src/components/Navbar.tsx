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
        background: '#ffffff',
        borderBottom: '2px solid #000000',
        padding: '0 24px',
        height: 56,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={toggleSidebar}
          style={{ fontSize: 18 }}
        />
        <Text
          strong
          style={{ fontSize: 18, cursor: 'pointer', letterSpacing: '-0.5px' }}
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
          <Button type="text" icon={<LogoutOutlined />} onClick={() => signOut()}>
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
