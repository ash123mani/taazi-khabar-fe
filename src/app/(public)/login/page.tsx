'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Typography, Button, Form, Input, Divider } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { useIsMobile } from '@/hooks/useIsMobile';

const { Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((s) => s.accessToken);
  const isMobile = useIsMobile();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  if (token) {
    router.push('/');
    return null;
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', paddingTop: isMobile ? 24 : 48 }}>
      <div
        style={{
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: 16,
          marginBottom: 28,
          textAlign: 'center',
        }}
      >
        <div
          className="newspaper-heading"
          style={{
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: '-0.5px',
            color: 'var(--color-text)',
            lineHeight: 1.1,
            marginBottom: 4,
          }}
        >
          Welcome Back
        </div>
        <Text
          style={{
            fontSize: 11,
            color: 'var(--color-text-tertiary)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Sign in to Taazi Khabar
        </Text>
      </div>

      {error && (
        <div
          style={{
            padding: '10px 14px',
            border: '1px solid #ef4444',
            marginBottom: 20,
            fontSize: 13,
            color: '#ef4444',
          }}
        >
          {error}
        </div>
      )}

      <Form layout="vertical" onFinish={handleSubmit} requiredMark={false} size="middle">
        <Form.Item
          label={
            <Text
              style={{
                color: 'var(--color-text-secondary)',
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Email
            </Text>
          }
          name="email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
          style={{ marginBottom: 16 }}
        >
          <Input
            prefix={<MailOutlined style={{ color: 'var(--color-text-tertiary)' }} />}
            placeholder="you@example.com"
            style={{ borderRadius: 0 }}
          />
        </Form.Item>

        <Form.Item
          label={
            <Text
              style={{
                color: 'var(--color-text-secondary)',
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Password
            </Text>
          }
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
          style={{ marginBottom: 20 }}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: 'var(--color-text-tertiary)' }} />}
            placeholder="••••••••"
            style={{ borderRadius: 0 }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            style={{
              height: 44,
              borderRadius: 0,
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      {process.env.NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN === 'true' && (
        <>
          <Divider style={{ borderColor: 'var(--color-border)', margin: '20px 0 16px', fontSize: 11, color: 'var(--color-text-tertiary)' }}>
            OR
          </Divider>

          <Button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            block
            size="large"
            icon={<GoogleOutlined />}
            style={{
              height: 44,
              borderRadius: 0,
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#4285f4';
              e.currentTarget.style.color = '#4285f4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            Sign in with Google
          </Button>
        </>
      )}

      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid var(--color-border)',
          textAlign: 'center',
        }}
      >
        <Text style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
          Don&rsquo;t have an account?{' '}
          <Link
            href="/register"
            style={{
              fontWeight: 600,
              color: 'var(--color-text)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--color-border)',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#6366f1';
              e.currentTarget.style.borderColor = '#6366f1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          >
            Create one now
          </Link>
        </Text>
      </div>
    </div>
  );
}
