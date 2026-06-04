'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const { data: session, status } = useSession()
  const { setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }
    if (session?.user) {
      const token = (session as any).access_token
      setUser({
        id: (session.user as any).id,
        email: session.user.email || '',
        name: session.user.name || '',
        is_admin: (session.user as any).is_admin || false,
      }, token)
    } else {
      logout()
    }
  }, [session, status, setUser, setLoading, logout])

  return {
    session,
    status,
    login: (provider?: string) => signIn(provider || 'credentials'),
    loginWithGoogle: () => signIn('google'),
    logout: () => signOut(),
  }
}
