'use client';

import { useState } from 'react';
import { Layout, Menu, Button, Space, Typography, Drawer } from 'antd';
import { useIsMobile } from '@/hooks/useIsMobile';
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
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useThemeStore } from '@/stores/themeStore';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const publicMenuItems = [
  { key: '/', icon: <BookOutlined />, label: 'Articles' },
  { key: '/quiz', icon: <QuestionCircleOutlined />, label: 'Quiz' },
  { key: '/bookmarks', icon: <HeartOutlined />, label: 'Bookmarks' },
  { key: '/analytics', icon: <TrophyOutlined />, label: 'Analytics' },
  { key: '/history', icon: <HistoryOutlined />, label: 'History' },
];

function selectedKey(pathname: string): string {
  if (pathname === '/') return '/';
  if (pathname.startsWith('/quiz')) return '/quiz';
  if (pathname.startsWith('/bookmarks')) return '/bookmarks';
  if (pathname.startsWith('/analytics')) return '/analytics';
  if (pathname.startsWith('/history')) return '/history';
  return '';
}

export default function PublicLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const isDark = useThemeStore((s) => s.isDark);
  const toggle = useThemeStore((s) => s.toggle);
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAdmin = (session?.user as any)?.is_admin;

  const nav = [
    ...publicMenuItems,
    ...(isAdmin ? [{ key: '/admin' as const, icon: <ThunderboltOutlined />, label: 'Admin' }] : []),
  ];

  const handleNav = (key: string) => {
    router.push(key);
    setDrawerOpen(false);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Masthead */}
      <div style={{ flexShrink: 0 }}>
        {/* Nameplate */}
        <div
          style={{
            textAlign: 'center',
            padding: isMobile ? '10px 12px 8px' : '18px 20px 12px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
            <div
              className="newspaper-heading"
              style={{
                fontWeight: 900,
                fontSize: isMobile ? 26 : 42,
                letterSpacing: isMobile ? '-0.5px' : '-1px',
                color: 'var(--color-text)',
                lineHeight: 1.05,
              }}
            >
              Taazi Khabar
            </div>
            <div
              style={{
                fontSize: isMobile ? 8 : 10,
                fontWeight: 500,
                letterSpacing: isMobile ? '2px' : '4px',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginTop: isMobile ? 2 : 4,
              }}
            >
              UPSC Current Affairs Digest
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '0 12px' : '0 20px',
            height: isMobile ? 40 : 44,
            background: 'var(--color-glass-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--color-glass-border)',
          }}
        >
          {isMobile ? (
            <div style={{ flex: 1 }} />
          ) : (
            <div style={{ flex: 1, overflow: 'hidden', margin: '0 auto', maxWidth: 680 }}>
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
                  lineHeight: '44px',
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              />
            </div>
          )}

          <Space style={{ flexShrink: 0 }} size={isMobile ? 2 : 8}>
            <Button
              type="text"
              size="small"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggle}
              style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}
            />
            {session ? (
              isMobile ? null : (
                <Button
                  type="text"
                  size="small"
                  icon={<LogoutOutlined />}
                  onClick={() => signOut()}
                  style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}
                >
                  Logout
                </Button>
              )
            ) : isMobile ? null : (
              <Button
                type="primary"
                ghost
                size="small"
                icon={<LoginOutlined />}
                onClick={() => router.push('/login')}
                style={{ fontSize: 12, height: 30, border: '1px solid var(--color-border)' }}
              >
                Login
              </Button>
            )}
            {isMobile && (
              <Button
                type="text"
                size="small"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
                style={{ color: 'var(--color-text-secondary)' }}
              />
            )}
          </Space>
        </Header>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <span className="newspaper-heading" style={{ fontSize: 18, fontWeight: 700 }}>
            Taazi Khabar
          </span>
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
              : [{ key: '/login', icon: <LoginOutlined />, label: 'Login' }]),
          ]}
          onClick={({ key }) => {
            if (key === '__logout__') {
              signOut();
              setDrawerOpen(false);
            } else handleNav(key);
          }}
          style={{
            borderInlineEnd: 'none',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        />
      </Drawer>

      {/* Content */}
      <Content
        style={{
          flex: 1,
          width: '100%',
          maxWidth: pathname === '/' ? 1200 : 820,
          margin: '0 auto',
          padding: isMobile ? '16px 20px' : '32px 48px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Content>

      {/* Footer */}
      <Footer
        style={{
          background: 'var(--color-bg)',
          padding: isMobile ? '20px 12px 16px' : '32px 24px 24px',
          borderTop: '1px solid var(--color-border-light)',
        }}
      >
        {isMobile ? (
          <div style={{ textAlign: 'center' }}>
            <div
              className="newspaper-heading"
              style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 6 }}
            >
              Taazi Khabar
            </div>
            <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 10, display: 'block', marginBottom: 4 }}>
              UPSC Current Affairs &bull; Daily Quiz
            </Text>
            <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 10, display: 'block' }}>
              &copy; {new Date().getFullYear()}
            </Text>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
            <div>
              <div
                className="newspaper-heading"
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: 8,
                  letterSpacing: '-0.3px',
                }}
              >
                Taazi Khabar
              </div>
              <div
                className="newspaper-body"
                style={{ color: 'var(--color-text-tertiary)', fontSize: 13, lineHeight: 1.7 }}
              >
                An AI-powered current affairs platform for UPSC preparation. Daily curated news, summaries, and quizzes
                to help you stay ahead.
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 12,
                }}
              >
                Sections
              </div>
              {['Articles', 'Quiz', 'Bookmarks', 'Analytics', 'History'].map((label) => (
                <div key={label} style={{ marginBottom: 6 }}>
                  <Text
                    onClick={() => router.push(`/${label.toLowerCase()}`)}
                    style={{
                      color: 'var(--color-text-tertiary)',
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
                  >
                    {label}
                  </Text>
                </div>
              ))}
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 12,
                }}
              >
                Built With
              </div>
              <div style={{ color: 'var(--color-text-tertiary)', fontSize: 13, lineHeight: 1.7 }}>
                <div>Next.js</div>
                <div>FastAPI</div>
                <div>NVIDIA NIM</div>
                <div>Ant Design</div>
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 12,
                }}
              >
                Info
              </div>
              <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 13, display: 'block' }}>
                &copy; {new Date().getFullYear()} Taazi Khabar
              </Text>
            </div>
          </div>
        )}
      </Footer>
    </Layout>
  );
}
