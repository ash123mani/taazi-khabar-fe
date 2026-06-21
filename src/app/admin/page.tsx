'use client';

import { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Statistic, Table, Tag, Button, message } from 'antd';
import dayjs from 'dayjs';
import { api } from '@/lib/api';

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.adminGetArticles({ limit: '50' }), api.getHistory()])
      .then(([articlesData, quizzesData]) => {
        const list = Array.isArray(articlesData) ? articlesData : articlesData.articles || [];
        setRecentArticles(list.slice(0, 5));
        const quizList = Array.isArray(quizzesData) ? quizzesData : quizzesData.quizzes || [];
        setRecentQuizzes(quizList);
        const totalScore = quizList.reduce((sum: number, q: any) => sum + (q.score || 0), 0);
        setStats({
          total_articles: list.length,
          total_quizzes: quizList.length,
          avg_score: quizList.length > 0 ? Math.round(totalScore / quizList.length) : 0,
        });
      })
      .catch(() => message.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const articleColumns = [
    {
      title: 'Title',
      dataIndex: 'headline',
      key: 'headline',
      render: (text: string) => <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => {
        const label: Record<string, string> = { thehindu: 'The Hindu', indianexpress: 'Indian Express', pib: 'PIB' };
        return (
          <Tag
            style={{
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 12,
              background: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            {label[source] || source}
          </Tag>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'published_at',
      key: 'published_at',
      render: (date: string) => (
        <span style={{ color: 'var(--color-text-tertiary)' }}>{date ? dayjs(date).format('DD-MM-YYYY') : '-'}</span>
      ),
    },
  ];

  const quizColumns = [
    {
      title: 'Score',
      key: 'score',
      render: (_: any, record: any) => {
        const pct = record.total_questions ? Math.round(((record.score || 0) / record.total_questions) * 100) : 0;
        const color = pct >= 60 ? '#22c55e' : pct >= 30 ? '#eab308' : '#ef4444';
        return (
          <span style={{ color, fontWeight: 600 }}>
            {record.score || 0}/{record.total_questions} ({pct}%)
          </span>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => (
        <span style={{ color: 'var(--color-text-tertiary)' }}>{date ? dayjs(date).format('DD-MM-YYYY') : '-'}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ color: 'var(--color-text-tertiary)' }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16, color: 'var(--color-text)' }}>
        Dashboard
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }}
            styles={{ body: { padding: 20 } }}
          >
            <Statistic
              title={
                <Text
                  style={{
                    color: 'var(--color-text-tertiary)',
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Total Articles
                </Text>
              }
              value={stats?.total_articles || 0}
              valueStyle={{ color: 'var(--color-text)', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }}
            styles={{ body: { padding: 20 } }}
          >
            <Statistic
              title={
                <Text
                  style={{
                    color: 'var(--color-text-tertiary)',
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Total Quizzes
                </Text>
              }
              value={stats?.total_quizzes || 0}
              valueStyle={{ color: 'var(--color-text)', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }}
            styles={{ body: { padding: 20 } }}
          >
            <Statistic
              title={
                <Text
                  style={{
                    color: 'var(--color-text-tertiary)',
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Avg Score
                </Text>
              }
              value={stats?.avg_score || 0}
              suffix="%"
              valueStyle={{ color: 'var(--color-text)', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }}
            styles={{ body: { padding: 20 } }}
          >
            <Statistic
              title={
                <Text
                  style={{
                    color: 'var(--color-text-tertiary)',
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Active Users
                </Text>
              }
              value={stats?.total_users || 0}
              valueStyle={{ color: 'var(--color-text)', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }}
            styles={{ body: { padding: 22 } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0, fontSize: 14, color: 'var(--color-text)' }}>
                Recent Articles
              </Title>
              <Button size="small" type="default" style={{ fontWeight: 600, borderRadius: 6 }}>
                View All
              </Button>
            </div>
            <Table columns={articleColumns} dataSource={recentArticles} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 12 }}
            styles={{ body: { padding: 22 } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0, fontSize: 14, color: 'var(--color-text)' }}>
                Recent Quizzes
              </Title>
              <Button size="small" type="default" style={{ fontWeight: 600, borderRadius: 6 }}>
                View All
              </Button>
            </div>
            <Table columns={quizColumns} dataSource={recentQuizzes} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
