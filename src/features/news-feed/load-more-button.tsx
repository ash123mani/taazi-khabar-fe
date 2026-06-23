'use client';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading: boolean;
  current: number;
  total: number;
}

export default function LoadMoreButton({
  onClick,
  loading,
  current,
  total,
}: LoadMoreButtonProps) {
  if (current >= total) return null;

  return (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      <button
        onClick={onClick}
        disabled={loading}
        className="load-more-btn"
        style={{
          padding: '6px 24px',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          border: '1px solid var(--color-border)',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: 'transparent',
          color: 'var(--color-text-tertiary)',
          transition: 'all 0.15s',
        }}
      >
        {loading
          ? 'Loading...'
          : `Load More (${current}/${total})`}
      </button>
      <style>{`
        .load-more-btn:hover:not(:disabled) {
          background: var(--color-surface) !important;
          color: var(--color-text) !important;
        }
        @media (max-width: 575px) {
          .load-more-btn {
            margin-top: 16px;
          }
        }
      `}</style>
    </div>
  );
}
