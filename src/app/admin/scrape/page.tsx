'use client';

import { useEffect, useState, useCallback } from 'react';
import { Typography, Tabs, Table, Tag, Button, Spin, message, Tooltip, Space } from 'antd';
import { ReloadOutlined, ThunderboltOutlined, LinkOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { api } from '@/lib/api';
import FormattedSummary from '@/components/FormattedSummary';

const { Title, Text } = Typography;

interface ScrapeDay {
  date: string;
  total_articles: number;
  scrape_times: string[];
  categories: Record<string, number>;
}

interface ScrapeArticle {
  id: string;
  headline: string;
  url: string;
  published_at: string;
  gk_summary: string | null;
  key_terms: string[] | null;
  syllabus_tag: string | null;
  scraped_at: string | null;
  image_url: string | null;
}

interface SourceData {
  [source: string]: ScrapeDay[];
}

const SOURCE_LABELS: Record<string, string> = {
  thehindu: 'The Hindu',
  indianexpress: 'The Indian Express',
  pib: 'PIB',
};

export default function ScrapePage() {
  const [sources, setSources] = useState<SourceData>({});
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [articlesCache, setArticlesCache] = useState<Record<string, ScrapeArticle[]>>({});
  const [loadingArticles, setLoadingArticles] = useState<Record<string, boolean>>({});

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getScrapeSummary(30);
      setSources(data.sources || {});
    } catch {
      message.error('Failed to load scrape data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleScrape = async (source: string, date: string) => {
    setScraping(`${source}:${date}`);
    try {
      const result = await api.scrapeDate(source, date);
      message.success(`Created ${result.articles_created} articles, filtered out ${result.articles_filtered_out}`);
      await fetchSummary();
    } catch (err: any) {
      message.error(err?.message || 'Scrape failed');
    } finally {
      setScraping(null);
    }
  };

  const handleExpand = async (source: string, date: string, expanded: boolean) => {
    const key = `${source}:${date}`;
    setExpandedKeys((prev) => (expanded ? [...prev, key] : prev.filter((k) => k !== key)));

    if (expanded && !articlesCache[key]) {
      setLoadingArticles((prev) => ({ ...prev, [key]: true }));
      try {
        const data = await api.getScrapeArticles(source, date);
        setArticlesCache((prev) => ({ ...prev, [key]: data.articles || [] }));
      } catch {
        message.error(`Failed to load articles for ${date}`);
      } finally {
        setLoadingArticles((prev) => ({ ...prev, [key]: false }));
      }
    }
  };

  const expandedRowRender = (record: ScrapeDay, source: string) => {
    const key = `${source}:${record.date}`;
    const loading = loadingArticles[key];
    const articles = articlesCache[key];
    const catEntries = Object.entries(record.categories);

    return (
      <div style={{ padding: '4px 0' }}>
        {catEntries.length > 0 && (
          <div
            style={{
              padding: '4px 12px 8px',
              borderBottom:
                catEntries.length > 0 && (!articles || articles.length === 0)
                  ? 'none'
                  : '1px solid var(--color-border)',
            }}
          >
            <Text style={{ fontSize: 12, marginRight: 8, color: 'var(--color-text-secondary)' }}>Categories:</Text>
            {catEntries.map(([cat, count]) => (
              <Tag
                key={cat}
                style={{
                  fontSize: 11,
                  marginBottom: 2,
                  background: 'var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {cat}: {count}
              </Tag>
            ))}
            {record.scrape_times.length > 0 && (
              <div style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 12, marginRight: 8, color: 'var(--color-text-secondary)' }}>Scraped at:</Text>
                {record.scrape_times.map((t) => (
                  <Text key={t} style={{ fontSize: 12, marginRight: 12, color: 'var(--color-text-secondary)' }}>
                    {dayjs(t).format('DD-MM-YYYY')}
                  </Text>
                ))}
              </div>
            )}
          </div>
        )}

        {loading && <Spin style={{ display: 'block', padding: 16 }} />}

        {!loading && (!articles || articles.length === 0) && (
          <Text style={{ padding: 12, display: 'block', color: 'var(--color-text-tertiary)' }}>No articles found.</Text>
        )}

        {!loading &&
          articles &&
          articles.map((a) => (
            <div
              key={a.id}
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              {a.image_url && (
                <img
                  src={a.image_url}
                  alt=""
                  style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.4, color: '#fafafa' }}
                >
                  {a.headline}
                </a>
                {a.syllabus_tag && (
                  <Tag
                    style={{
                      fontSize: 10,
                      marginLeft: 4,
                      background: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {a.syllabus_tag}
                  </Tag>
                )}
                {a.gk_summary && (
                  <div style={{ marginTop: 4 }}>
                    <FormattedSummary summary={a.gk_summary} />
                  </div>
                )}
                {a.key_terms && a.key_terms.length > 0 && (
                  <div style={{ marginTop: 2 }}>
                    {a.key_terms.map((t: string) => (
                      <Tag
                        key={t}
                        style={{
                          fontSize: 10,
                          marginRight: 2,
                          background: 'var(--color-border)',
                          color: 'var(--color-text-secondary)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        {t}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
              <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, marginTop: 4 }}>
                <LinkOutlined style={{ color: 'var(--color-text-secondary)' }} />
              </a>
            </div>
          ))}
      </div>
    );
  };

  const tableColumns = (source: string) => [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 130,
      render: (d: string) => {
        const dt = new Date(d + 'T00:00:00');
        const today = new Date();
        const isToday = dt.toDateString() === today.toDateString();
        return (
          <Text strong style={isToday ? { color: '#fafafa' } : { color: '#d4d4d8' }}>
            {d}
            {isToday ? ' (Today)' : ''}
          </Text>
        );
      },
      sorter: (a: ScrapeDay, b: ScrapeDay) => b.date.localeCompare(a.date),
    },
    {
      title: 'Articles',
      dataIndex: 'total_articles',
      key: 'total_articles',
      width: 90,
      render: (n: number) => <Tag color={n > 0 ? 'success' : 'default'}>{n}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_: any, record: ScrapeDay) => {
        if (record.total_articles > 0) {
          return (
            <Tooltip title={`${record.total_articles} articles scraped`}>
              <Button size="small" disabled>
                Scraped
              </Button>
            </Tooltip>
          );
        }
        const busy = scraping === `${source}:${record.date}`;
        return (
          <Button
            size="small"
            type="primary"
            icon={<ThunderboltOutlined />}
            loading={busy}
            disabled={!!scraping}
            onClick={(e) => {
              e.stopPropagation();
              handleScrape(source, record.date);
            }}
          >
            Scrape
          </Button>
        );
      },
    },
  ];

  const tabItems = Object.entries(SOURCE_LABELS).map(([key, label]) => ({
    key,
    label,
    children: loading ? (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
      </div>
    ) : (
      <div style={{ overflowX: 'auto' }}>
        <Table
          dataSource={sources[key] || []}
          columns={tableColumns(key)}
          rowKey="date"
          pagination={false}
          size="small"
          style={{ marginTop: 4 }}
          expandable={{
            expandedRowRender: (record: ScrapeDay) => expandedRowRender(record, key),
            rowExpandable: (record: ScrapeDay) => record.total_articles > 0,
            onExpand: (expanded: boolean, record: ScrapeDay) => handleExpand(key, record.date, expanded),
            expandedRowKeys: expandedKeys.filter((k) => k.startsWith(`${key}:`)).map((k) => k.split(':')[1]),
          }}
        />
      </div>
    ),
  }));

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Title level={4} style={{ margin: 0, letterSpacing: '-0.5px', color: '#fafafa' }}>
          Scrape by Date
        </Title>
        <Button icon={<ReloadOutlined />} onClick={fetchSummary} loading={loading} size="small">
          Refresh
        </Button>
      </div>
      <Text style={{ display: 'block', marginBottom: 20, color: 'var(--color-text-secondary)' }}>
        Click a date row to expand and view articles. Unscraped dates show a Scrape button.
      </Text>

      <Tabs items={tabItems} />
    </div>
  );
}
