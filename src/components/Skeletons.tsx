import { Card, Skeleton as AntSkeleton, Space } from 'antd'

export function ArticleSkeleton() {
  return (
    <Card style={{ borderRadius: 12, marginBottom: 12, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: '14px 18px' } }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <AntSkeleton.Image active style={{ width: 90, height: 68, borderRadius: 8 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <AntSkeleton active title={false} paragraph={{ rows: 2, width: ['75%', '45%'] }} />
        </div>
      </div>
    </Card>
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
