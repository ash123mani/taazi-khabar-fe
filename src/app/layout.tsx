import type { Metadata } from 'next';
import './globals.css';
import RootLayoutClient from '@/components/RootLayoutClient';

export const metadata: Metadata = {
  title: 'Taazi Khabar - UPSC Current Affairs',
  description: 'AI-powered current affairs platform for UPSC preparation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = JSON.parse(localStorage.getItem('taazi-theme') || '{}');
                if (t.state && t.state.isDark) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body style={{ margin: 0 }}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
