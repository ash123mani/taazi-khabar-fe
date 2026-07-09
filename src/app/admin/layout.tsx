'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Button, Typography, Dropdown, Avatar, Space, theme } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  TagsOutlined,
  DatabaseOutlined,
  RobotOutlined,
  ScissorOutlined,
  FileSearchOutlined,
  SafetyOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/admin/articles', icon: <FileTextOutlined />, label: 'Articles' },
  { key: '/admin/categories', icon: <TagsOutlined />, label: 'Categories' },
  { key: '/admin/datasets', icon: <DatabaseOutlined />, label: 'Datasets' },
  { key: '/admin/models', icon: <RobotOutlined />, label: 'Models' },
  { key: '/admin/scrape', icon: <ScissorOutlined />, label: 'Scrape' },
  { key: '/admin/summaries', icon: <FileSearchOutlined />, label: 'Summaries' },
  { key: '/admin/training-data', icon: <DatabaseOutlined />, label: 'Training Data' },
  { key: '/admin/users', icon: <SafetyOutlined />, label: 'Users' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: '#000000',
          borderRight: '1px solid var(--color-border)',
        }}
        width={240}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Text
              strong
              style={{
                fontSize: collapsed ? 16 : 18,
                color: '#ffffff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {collapsed ? 'TK' : 'Taazi Khabar'}
            </Text>
          </Link>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{
            background: '#000000',
            borderRight: 0,
            padding: '8px 0',
          }}
          theme="dark"
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1f1f1f',
            height: 64,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 16,
              width: 48,
              height: 48,
              color: colorText,
            }}
          />
          <Space size={16}>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#ffffff', color: '#000000' }} icon={<UserOutlined />} />
                <Text style={{ color: colorText }}>{user?.name || user?.email || 'Admin'}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: 12,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
