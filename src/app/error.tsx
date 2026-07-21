'use client';

import { Button, Typography, Space } from 'antd';

const { Text, Title } = Typography;

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          Something went wrong
        </Title>
        <Text style={{ display: 'block', marginBottom: 8, color: '#9e9e9e' }}>
          {error.message || 'An unexpected error occurred'}
        </Text>
        <Text style={{ display: 'block', marginBottom: 24, fontSize: 13, color: '#757575' }}>
          Please try again or return to the homepage.
        </Text>
        <Space size={12}>
          <Button onClick={reset}>Try again</Button>
          <Button type="primary" onClick={() => (window.location.href = '/')}>
            Go home
          </Button>
        </Space>
      </div>
    </div>
  );
}
