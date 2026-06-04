'use client'

import { Layout } from 'antd'
import Providers from './providers'
import Navbar from './Navbar'

const { Content } = Layout

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ maxWidth: 900, margin: '0 auto', width: '100%', padding: '32px 24px' }}>
          {children}
        </Content>
      </Layout>
    </Providers>
  )
}
