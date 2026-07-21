import type { Metadata } from 'next';
import './globals.css';
import RootLayoutClient from '@/components/RootLayoutClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taazikhabar.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Taazi Khabar',
    default: 'Taazi Khabar - UPSC Current Affairs',
  },
  description:
    'AI-powered current affairs platform for UPSC preparation. Daily news analysis, quizzes, and personalized learning for competitive exams.',
  openGraph: {
    title: 'Taazi Khabar - UPSC Current Affairs',
    description:
      'AI-powered current affairs platform for UPSC preparation. Daily news analysis, quizzes, and personalized learning for competitive exams.',
    siteName: 'Taazi Khabar',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taazi Khabar - UPSC Current Affairs',
    description:
      'AI-powered current affairs platform for UPSC preparation. Daily news analysis, quizzes, and personalized learning for competitive exams.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
