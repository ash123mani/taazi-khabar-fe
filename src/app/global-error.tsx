'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '0 24px',
            backgroundColor: '#f5f5f5',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <h1 style={{ fontSize: 24, marginBottom: 8, color: '#262626' }}>Critical error</h1>
            <p style={{ marginBottom: 8, color: '#9e9e9e' }}>
              {error.message || 'An unexpected error occurred'}
            </p>
            <p style={{ marginBottom: 24, fontSize: 13, color: '#757575' }}>
              A critical error has occurred. Please refresh the page to try again.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '8px 24px',
                fontSize: 14,
                border: 'none',
                borderRadius: 6,
                backgroundColor: '#1677ff',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
