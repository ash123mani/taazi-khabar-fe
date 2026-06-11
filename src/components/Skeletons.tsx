import { Card, Skeleton as AntSkeleton, Space } from 'antd'

export function ArticleSkeleton() {
  return (
    <Card style={{ borderRadius: 12, marginBottom: 16, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }} styles={{ body: { padding: 0 } }}>
      <div style={{ padding: '20px 24px' }}>
        <AntSkeleton active paragraph={{ rows: 2 }} title={{ width: '70%' }} />
        <div style={{ marginTop: 12 }}>
          <AntSkeleton active paragraph={{ rows: 3 }} title={false} />
        </div>
        <div style={{ marginTop: 14 }}>
          <AntSkeleton active paragraph={{ rows: 1 }} title={false} />
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
