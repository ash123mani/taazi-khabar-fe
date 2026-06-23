import { Skeleton } from 'antd';

export default function NewsFeedLoading() {
  return (
    <div>
      <div
        style={{
          borderBottom: '1px solid var(--color-border-light)',
          paddingBottom: 12,
          marginBottom: 12,
        }}
      >
        <Skeleton active paragraph={{ rows: 0 }} title={{ width: '35%' }} />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          padding: '4px 0',
          marginBottom: 10,
          borderBottom: '1px solid var(--color-border-light)',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} active paragraph={{ rows: 0 }} title={{ width: 60 }} />
        ))}
      </div>

      <style>{`
        .loading-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .loading-cell {
          border-bottom: 1px solid var(--color-border-light);
          padding: 10px 12px;
        }
        .loading-cell:nth-child(odd) {
          border-right: 1px solid var(--color-border-light);
        }
        .loading-image {
          flex-shrink: 0;
          width: 80px;
          height: 60px;
          background: linear-gradient(
            90deg,
            var(--color-border) 25%,
            var(--color-border-light) 50%,
            var(--color-border) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-border);
          flex-shrink: 0;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .loading-chip {
          width: 40px;
          height: 18px;
          border-radius: 2px;
          background: var(--color-border);
        }
        @media (max-width: 575px) {
          .loading-grid {
            grid-template-columns: 1fr;
          }
          .loading-cell {
            padding: 8px 0;
            border-right: none !important;
          }
          .loading-image {
            width: 48px;
            height: 36px;
          }
        }
      `}</style>

      <div className="loading-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="loading-cell">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div className="loading-image" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    gap: 4,
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <div className="loading-dot" />
                  <Skeleton
                    active
                    title={false}
                    paragraph={{ rows: 0 }}
                    style={{ width: 70 }}
                  />
                  <Skeleton
                    active
                    title={false}
                    paragraph={{ rows: 0 }}
                    style={{ width: 50 }}
                  />
                </div>
                <Skeleton
                  active
                  title={false}
                  paragraph={{ rows: 2, width: ['90%', '55%'] }}
                />
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  <div className="loading-chip" />
                  <div className="loading-chip" style={{ width: 55 }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
