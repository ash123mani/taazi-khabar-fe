import type { Metadata } from 'next'
import './globals.css'
import RootLayoutClient from '@/components/RootLayoutClient'

export const metadata: Metadata = {
  title: 'Taazi Khabar - UPSC Current Affairs',
  description: 'AI-powered current affairs platform for UPSC preparation',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
