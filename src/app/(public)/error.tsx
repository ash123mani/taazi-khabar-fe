'use client';

import { Button, Typography } from 'antd';

const { Text, Title } = Typography;

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <Title level={4} style={{ marginBottom: 8 }}>
        Something went wrong
      </Title>
      <Text style={{ display: 'block', marginBottom: 24, color: '#9e9e9e' }}>
        {error.message || 'An unexpected error occurred'}
      </Text>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
