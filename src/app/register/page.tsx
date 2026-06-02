'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Typography, Button } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'

const { Title, Text } = Typography

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.register({ email, password, name })
      router.push('/login')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '48px auto' }}>
      <div style={{ border: '2px solid #000', padding: 32, background: '#fff' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 4, letterSpacing: '-0.5px' }}>Create Account</Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24, color: '#666' }}>
          Join Taazi Khabar for UPSC preparation
        </Text>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#000' }}>
              Name
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #000' }}>
              <span style={{ padding: '0 12px', color: '#999' }}><UserOutlined /></span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '10px 12px 10px 0',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  background: 'transparent',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#000' }}>
              Email
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #000' }}>
              <span style={{ padding: '0 12px', color: '#999' }}><MailOutlined /></span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '10px 12px 10px 0',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  background: 'transparent',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#000' }}>
              Password
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #000' }}>
              <span style={{ padding: '0 12px', color: '#999' }}><LockOutlined /></span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '10px 12px 10px 0',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  background: 'transparent',
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{ padding: 10, border: '2px solid #000', background: '#f5f5f5', marginBottom: 16, fontSize: 13 }}>
              {error}
            </div>
          )}

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              borderRadius: 0,
              height: 44,
              fontWeight: 700,
              fontSize: 14,
              border: '2px solid #000',
            }}
          >
            Register
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text style={{ color: '#666', fontSize: 13 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#000', fontWeight: 600, textDecoration: 'underline' }}>
              Login
            </Link>
          </Text>
        </div>
      </div>
    </div>
  )
}
