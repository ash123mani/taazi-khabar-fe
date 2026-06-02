'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as { name?: string; is_admin?: boolean } | undefined;

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-accent">
            Taazi Khabar
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              News Feed
            </Link>
            <Link href="/quiz" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Quiz
            </Link>
            <Link href="/history" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              History
            </Link>
            {user?.is_admin && (
              <Link href="/admin" className="text-sm text-accent hover:text-accent-hover transition-colors">
                Admin
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-text-muted hidden sm:block">{user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-accent hover:bg-accent-hover text-surface font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
