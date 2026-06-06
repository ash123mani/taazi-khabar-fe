'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import { useAuth } from '@/hooks/useAuth'
import ThemeProvider from './ThemeProvider'

function AuthSync({ children }: { children: React.ReactNode }) {
  useAuth()
  return <>{children}</>
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <StyleProvider hashPriority="high">
          <ThemeProvider>
            <AuthSync>{children}</AuthSync>
          </ThemeProvider>
        </StyleProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
