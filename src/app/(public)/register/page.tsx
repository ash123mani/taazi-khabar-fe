'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Typography, Button, Form, Input, Card } from 'antd'
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
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
      await api.register({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      router.push('/login')
    } catch (err: any) {
      let msg = 'Registration failed'
      try { msg = JSON.parse(err.message).detail || msg } catch {}
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Card className="article-card" styles={{ body: { padding: 28 } }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 4, letterSpacing: '-0.5px' }}>
          Create account
        </Title>
        <Text style={{ display: 'block', textAlign: 'center', marginBottom: 24, color: '#9e9e9e', fontSize: 14 }}>
          Get started with Taazi Khabar
        </Text>

        <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
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
            <div style={{ padding: '8px 12px', border: '1px solid #c62828', borderRadius: 6, marginBottom: 16, fontSize: 13, color: '#c62828', background: '#ffebee' }}>
              {error}
            </div>
          )}

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ height: 44 }}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Text style={{ fontSize: 13, color: '#9e9e9e' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline' }}>
            Login
          </Link>
        </Text>
      </div>
    </div>
  )
}
