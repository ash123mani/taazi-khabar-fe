import { Skeleton } from 'antd';

export default function GridSkeleton() {
  return (
    <>
      <style>{`
        .gs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .gs-cell {
          border-bottom: 1px solid var(--color-border-light);
          padding: 10px 12px;
        }
        .gs-cell:nth-child(odd) {
          border-right: 1px solid var(--color-border-light);
        }
        .gs-img {
          flex-shrink: 0;
          width: 80px;
          height: 60px;
          background: linear-gradient(90deg, var(--color-border) 25%, var(--color-border-light) 50%, var(--color-border) 75%);
          background-size: 200% 100%;
          animation: gs-shimmer 1.5s infinite;
        }
        @keyframes gs-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 575px) {
          .gs-grid {
            grid-template-columns: 1fr;
          }
          .gs-cell {
            padding: 8px 0;
            border-right: none !important;
          }
          .gs-img {
            width: 48px;
            height: 36px;
          }
        }
      `}</style>
      <div className="gs-grid" data-testid="grid-skeleton">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="gs-cell">
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="gs-img" />
              <div style={{ flex: 1 }}>
                <Skeleton
                  active
                  title={false}
                  paragraph={{ rows: 2, width: ['90%', '55%'] }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
