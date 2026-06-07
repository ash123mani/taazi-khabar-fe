'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Typography, Button, Form, Input, Card, Row, Col, Divider, Space } from 'antd'
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
    <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#0a0a0b', padding: '24px' }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <Card
          style={{ borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)', border: '1px solid #27272a', background: '#141416', overflow: 'hidden' }}
          styles={{ body: { padding: '48px 40px' } }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              boxShadow: '0 10px 25px -5px rgba(99,102,241,0.4)',
            }}>
              <BookOutlined style={{ fontSize: 32, color: '#fff' }} />
            </div>
            <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px', fontWeight: 700, color: '#fafafa', fontSize: 26 }}>
              Welcome back
            </Title>
            <Paragraph style={{ color: '#a1a1aa', fontSize: 15, marginBottom: 0, marginTop: 8, lineHeight: 1.5 }}>
              Sign in to your Taazi Khabar account
            </Paragraph>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a1a1aa', fontSize: 13 }}>
              <SafetyOutlined style={{ color: '#10b981' }} />
              <span>Secure Login</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a1a1aa', fontSize: 13 }}>
              <BookOutlined style={{ color: '#6366f1' }} />
              <span>UPSC Prep</span>
            </div>
          </div>

          {/* Error Alert */}
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

          {/* Form */}
          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false} size="large">
            <Form.Item
              label={<Text style={{ color: '#d4d4d8', fontWeight: 500, fontSize: 14 }}>Email</Text>}
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
              style={{ marginBottom: 20 }}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#a1a1aa' }} />}
                placeholder="you@example.com"
                style={{ borderRadius: 10, background: '#0a0a0b', border: '1px solid #27272a', padding: '10px 14px' }}
              />
            </Form.Item>

            <Form.Item
              label={<Text style={{ color: '#d4d4d8', fontWeight: 500, fontSize: 14 }}>Password</Text>}
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
              style={{ marginBottom: 24 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#a1a1aa' }} />}
                placeholder="••••••••"
                style={{ borderRadius: 10, background: '#0a0a0b', border: '1px solid #27272a', padding: '10px 14px' }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 50,
                  borderRadius: 12,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  border: 'none',
                  fontSize: 16,
                  boxShadow: '0 10px 25px -5px rgba(99,102,241,0.4)'
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '28px 0', borderColor: '#27272a' }} />

          <div style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: 14, color: '#a1a1aa' }}>
              Don't have an account?{' '}
              <Link
                href="/register"
                style={{
                  fontWeight: 600,
                  color: '#818cf8',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#6366f1'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#818cf8'}
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
