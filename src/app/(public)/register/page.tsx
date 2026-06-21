'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Typography, Button, Form, Input } from 'antd'
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'
import { useIsMobile } from '@/hooks/useIsMobile'

const { Text } = Typography

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isMobile = useIsMobile()

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
    <div style={{ maxWidth: 420, margin: '0 auto', paddingTop: isMobile ? 24 : 48 }}>
      <div style={{
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: 16,
        marginBottom: 28,
        textAlign: 'center',
      }}>
        <div className="newspaper-heading" style={{
          fontWeight: 900,
          fontSize: 28,
          letterSpacing: '-0.5px',
          color: 'var(--color-text)',
          lineHeight: 1.1,
          marginBottom: 4,
        }}>
          Create Account
        </div>
        <Text style={{
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}>
          Get started with Taazi Khabar
        </Text>
      </div>

      {error && (
        <div style={{
          padding: '10px 14px',
          border: '1px solid #ef4444',
          marginBottom: 20,
          fontSize: 13,
          color: '#ef4444',
        }}>
          {error}
        </div>
      )}

      <Form layout="vertical" onFinish={handleSubmit} requiredMark={false} size="middle">
        <Form.Item
          label={<Text style={{ color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Full Name</Text>}
          name="name"
          rules={[{ required: true, message: 'Please enter your name' }]}
          style={{ marginBottom: 16 }}
        >
          <Input
            prefix={<UserOutlined style={{ color: 'var(--color-text-tertiary)' }} />}
            placeholder="Your full name"
            style={{ borderRadius: 0 }}
          />
        </Form.Item>
        <Form.Item
          label={<Text style={{ color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Email</Text>}
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
          label={<Text style={{ color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Password</Text>}
          name="password"
          rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}
          style={{ marginBottom: 20 }}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: 'var(--color-text-tertiary)' }} />}
            placeholder="At least 6 characters"
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
            Create Account
          </Button>
        </Form.Item>
      </Form>

      <div style={{
        marginTop: 20,
        paddingTop: 16,
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
      }}>
        <Text style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
          Already have an account?{' '}
          <Link
            href="/login"
            style={{
              fontWeight: 600,
              color: 'var(--color-text)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--color-border)',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.borderColor = '#6366f1' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'var(--color-border)' }}
          >
            Sign in
          </Link>
        </Text>
      </div>
    </div>
  )
}
