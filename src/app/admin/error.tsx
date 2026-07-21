'use client';

import { Button, Typography, Space } from 'antd';

const { Text, Title } = Typography;

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <Title level={4} style={{ marginBottom: 8 }}>
        Something went wrong
      </Title>
      <Text style={{ display: 'block', marginBottom: 8, color: '#9e9e9e' }}>
        {error.message || 'An unexpected error occurred'}
      </Text>
      <Text style={{ display: 'block', marginBottom: 24, fontSize: 13, color: '#757575' }}>
        Please try again or return to the admin dashboard.
      </Text>
      <Space size={12}>
        <Button onClick={reset}>Try again</Button>
        <Button type="primary" onClick={() => (window.location.href = '/admin')}>
          Go to dashboard
        </Button>
      </Space>
    </div>
  );
}
