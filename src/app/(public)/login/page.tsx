'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Typography, Button, Form, Input } from 'antd'
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
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
      <Title level={3} style={{
        textAlign: 'center',
        marginBottom: 4,
        letterSpacing: '-0.5px',
        color: '#1a1a1a',
      }}>
        Login
      </Title>
      <Text style={{ display: 'block', textAlign: 'center', marginBottom: 28, color: '#9e9e9e', fontSize: 14 }}>
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
          <div style={{ padding: 10, border: '1px solid #c62828', marginBottom: 16, fontSize: 13, color: '#c62828', background: '#ffebee' }}>
            {error}
          </div>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            Login
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Text style={{ fontSize: 13, color: '#9e9e9e' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline' }}>
            Register
          </Link>
        </Text>
      </div>
    </div>
  )
}
