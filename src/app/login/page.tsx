'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Typography, Button, Form, Input, Divider } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    if (res?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '48px auto' }}>
      <div className="glass-card" style={{ padding: 32, borderRadius: 12 }}>
        <Title level={3} style={{
          textAlign: 'center',
          marginBottom: 4,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Login
        </Title>
        <Text style={{ display: 'block', textAlign: 'center', marginBottom: 28, opacity: 0.5, fontSize: 14 }}>
          Sign in to your Taazi Khabar account
        </Text>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="you@example.com" size="large" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
          </Form.Item>

          {error && (
            <div style={{ padding: 10, border: '1px solid var(--ant-color-error)', marginBottom: 16, fontSize: 13 }}>
              {error}
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Login
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>OR</Divider>

        <Button
          block
          size="large"
          onClick={() => signIn('google', { callbackUrl: '/' })}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text style={{ fontSize: 13, opacity: 0.6 }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ fontWeight: 600, textDecoration: 'underline' }}>
              Register
            </Link>
          </Text>
        </div>
      </div>
    </div>
  )
}
