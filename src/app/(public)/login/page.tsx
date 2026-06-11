'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Typography, Button, Form, Input, Card, Row, Col, Divider } from 'antd'
import { MailOutlined, LockOutlined, BookOutlined, SafetyOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'

const { Title, Text, Paragraph } = Typography

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const token = useAuthStore((s) => s.accessToken)

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

  if (token) {
    router.push('/')
    return null
  }

  return (
    <Row justify="center" align="middle" style={{ height: '100%', padding: '12px' }}>
      <Col xs={24} sm={22} md={20} lg={18} xl={18}>
        <Card
          style={{ borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', overflow: 'hidden' }}
          styles={{ body: { padding: '24px 32px' } }}
        >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)',
            }}>
              <BookOutlined style={{ fontSize: 24, color: '#ffffff' }} />
            </div>
            <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px', fontWeight: 700, color: 'var(--color-text)', fontSize: 22 }}>
              Welcome back
            </Title>
            <Paragraph style={{ color: 'var(--color-text-tertiary)', fontSize: 14, marginBottom: 0, marginTop: 4, lineHeight: 1.4 }}>
              Sign in to your Taazi Khabar account
            </Paragraph>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-tertiary)', fontSize: 12 }}>
              <SafetyOutlined style={{ color: '#22c55e' }} />
              <span>Secure Login</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-tertiary)', fontSize: 12 }}>
              <BookOutlined style={{ color: '#6366f1' }} />
              <span>UPSC Prep</span>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              border: '1px solid #ef4444',
              borderRadius: 12,
              marginBottom: 20,
              fontSize: 14,
              color: '#fca5a5',
              background: 'rgba(239,68,68,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>!</span>
              </div>
              {error}
            </div>
          )}

          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false} size="middle">
            <Form.Item
              label={<Text style={{ color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 14 }}>Email</Text>}
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
              style={{ marginBottom: 14 }}
            >
              <Input
                prefix={<MailOutlined style={{ color: 'var(--color-text-tertiary)' }} />}
                placeholder="you@example.com"
              />
            </Form.Item>

            <Form.Item
              label={<Text style={{ color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 14 }}>Password</Text>}
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
              style={{ marginBottom: 16 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'var(--color-text-tertiary)' }} />}
                placeholder="••••••••"
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
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '16px 0', borderColor: 'var(--color-border)' }} />

          <div style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: 14, color: 'var(--color-text-tertiary)' }}>
              Don't have an account?{' '}
              <Link
                href="/register"
                  style={{
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#6366f1'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
              >
                Create one now
              </Link>
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  )
}
