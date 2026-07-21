'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Typography, Space } from 'antd';

const { Text, Title } = Typography;

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Title level={5} style={{ marginBottom: 8 }}>
            Something went wrong
          </Title>
          <Text style={{ display: 'block', marginBottom: 24, color: '#9e9e9e' }}>
            {this.state.error?.message || 'An unexpected error occurred in this section'}
          </Text>
          <Space size={12}>
            <Button onClick={this.handleReset}>Try again</Button>
            <Button onClick={() => (window.location.href = '/')}>Go home</Button>
          </Space>
        </div>
      );
    }

    return this.props.children;
  }
}
