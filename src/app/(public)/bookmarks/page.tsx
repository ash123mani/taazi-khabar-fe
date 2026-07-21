import type { Metadata } from 'next';
import { serverFetch } from '@/lib/server-fetch';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import BookmarksList from './_components/BookmarksList';

export const metadata: Metadata = {
  title: 'Bookmarks',
  description: 'Your saved articles for UPSC current affairs preparation on Taazi Khabar.',
  robots: { index: false, follow: false },
};

function BookmarksSkeleton() {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 6 }}>
        Reading List
      </div>
      <div className="newspaper-heading" style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.3px', color: 'var(--color-text)', lineHeight: 1.15, marginBottom: 24 }}>
        Clippings
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ background: 'var(--color-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--color-border)', height: 80 }} />
        ))}
      </div>
    </div>
  );
}

async function BookmarksContent() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/bookmarks');

  const articles = await serverFetch<any[]>('/bookmarks/articles').catch(() => []);

  return <BookmarksList articles={articles} />;
}

export default function BookmarksPage() {
  return (
    <Suspense fallback={<BookmarksSkeleton />}>
      <BookmarksContent />
    </Suspense>
  );
}
