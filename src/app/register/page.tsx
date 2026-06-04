'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Typography, Button, Form, Input } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'

const { Title, Text } = Typography

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: { name: string; email: string; password: string }) => {
    setLoading(true)
    setError('')

    try {
      await api.register(values)
      router.push('/login')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
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
          Create Account
        </Title>
        <Text style={{ display: 'block', textAlign: 'center', marginBottom: 28, opacity: 0.5, fontSize: 14 }}>
          Join Taazi Khabar for UPSC preparation
        </Text>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="Your name" size="large" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="you@example.com" size="large" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="At least 6 characters" size="large" />
          </Form.Item>

          {error && (
            <div style={{ padding: 10, border: '1px solid var(--ant-color-error)', marginBottom: 16, fontSize: 13 }}>
              {error}
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Register
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text style={{ fontSize: 13, opacity: 0.6 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ fontWeight: 600, textDecoration: 'underline' }}>
              Login
            </Link>
          </Text>
        </div>
      </div>
    </div>
  )
}
