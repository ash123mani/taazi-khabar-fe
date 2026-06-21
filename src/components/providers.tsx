'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ThemeProvider from './ThemeProvider';
import { ArticleModalProvider } from './ArticleModalContext';

function AuthSync({ children }: { children: React.ReactNode }) {
  useAuth();
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const cache = useRef(createCache());

  useServerInsertedHTML(() => <style dangerouslySetInnerHTML={{ __html: extractStyle(cache.current) }} />);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <StyleProvider cache={cache.current}>
          <ThemeProvider>
            <AuthSync>
              <ArticleModalProvider>{children}</ArticleModalProvider>
            </AuthSync>
          </ThemeProvider>
        </StyleProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
