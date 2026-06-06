'use client'

import { Layout, Menu, Button, Space, Typography } from 'antd'
import {
  BookOutlined,
  QuestionCircleOutlined,
  HistoryOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const { Header } = Layout
const { Text } = Typography

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

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
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Text
          strong
          style={{
            fontSize: 18,
            cursor: 'pointer',
            letterSpacing: '-0.5px',
            color: '#1a1a1a',
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
  )
}
