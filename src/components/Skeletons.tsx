import { Skeleton as AntSkeleton, Space, Card } from 'antd'
import { useIsMobile } from '@/hooks/useIsMobile'

export function ArticleSkeleton({ hasImage = true }: { hasImage?: boolean }) {
  const isMobile = useIsMobile()

  return (
    <div style={{ display: 'flex', gap: isMobile ? 6 : 12, alignItems: 'flex-start' }}>
      {hasImage && (
        <div style={{ flexShrink: 0, width: isMobile ? 48 : 80, height: isMobile ? 36 : 60, overflow: 'hidden', background: 'var(--color-border)' }}>
          <AntSkeleton.Node active style={{ width: isMobile ? 48 : 80, height: isMobile ? 36 : 60, display: 'flex', borderRadius: 0 }} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: isMobile ? 4 : 6 }}>
          <AntSkeleton.Node active style={{ width: isMobile ? 6 : 8, height: isMobile ? 6 : 8, borderRadius: '50%' }} />
          <AntSkeleton active title={false} paragraph={{ rows: 0 }} style={{ width: isMobile ? 50 : 70 }} />
          <AntSkeleton active title={false} paragraph={{ rows: 0 }} style={{ width: isMobile ? 35 : 50 }} />
        </div>
        <AntSkeleton active title={false} paragraph={{ rows: isMobile ? 2 : 2, width: isMobile ? ['85%', '50%'] : ['90%', '55%'] }} />
        {!isMobile && (
          <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
            <AntSkeleton.Node active style={{ width: 40, height: 18 }} />
            <AntSkeleton.Node active style={{ width: 55, height: 18 }} />
          </div>
        )}
      </div>
    </div>
  )
}

export function QuizSkeleton() {
  return (
    <Space direction="vertical" size={14} style={{ width: '100%' }}>
      <Card style={{ borderRadius: 12, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: 18 } }}>
        <AntSkeleton active paragraph={{ rows: 1 }} title={{ width: '40%' }} />
      </Card>
      {[1, 2, 3].map((i) => (
        <Card key={i} style={{ borderRadius: 12, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: 20 } }}>
          <AntSkeleton active paragraph={{ rows: 1 }} title={{ width: '30%' }} />
          <div style={{ marginTop: 16 }}>
            <AntSkeleton active paragraph={{ rows: 4 }} title={false} />
          </div>
        </Card>
      ))}
    </Space>
  )
}
