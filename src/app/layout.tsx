import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/providers';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Taazi Khabar - UPSC Current Affairs',
  description: 'AI-powered current affairs platform for UPSC preparation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
