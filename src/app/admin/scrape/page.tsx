'use client'

import { useEffect, useState, useCallback } from 'react'
import { Typography, Spin, Button, Tag, message } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { api } from '@/lib/api'

const { Title, Text } = Typography

interface DateEntry {
  date: string
  scraped: boolean
}

export default function ScrapePage() {
  const [datesBySource, setDatesBySource] = useState<Record<string, DateEntry[]>>({})
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchDates = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getScrapeDates(30)
      setDatesBySource(data.dates || {})
    } catch {
      setError('Failed to load dates')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDates() }, [fetchDates])

  const handleScrape = async (source: string, date: string) => {
    setScraping(`${source}:${date}`)
    setError('')
    try {
      const result = await api.scrapeDate(source, date)
      message.success(`Created ${result.articles_created} articles, filtered out ${result.articles_filtered_out}`)
      await fetchDates()
    } catch (err: any) {
      message.error(err.message || 'Scrape failed')
    } finally {
      setScraping(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Title level={4} style={{
          margin: 0,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Scrape by Date
        </Title>
        <Button icon={<ReloadOutlined />} onClick={fetchDates} loading={loading} size="small">
          Refresh
        </Button>
      </div>
      <Text style={{ display: 'block', marginBottom: 24, opacity: 0.5 }}>
        Green dates have articles, gray dates need scraping. Click a gray date to scrape.
      </Text>

      {error && <div style={{ padding: 12, border: '1px solid var(--ant-color-error)', marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
      ) : (
        Object.entries(datesBySource).map(([source, dates]) => (
          <div key={source} style={{ marginBottom: 32 }}>
            <Title level={5} style={{ marginBottom: 12, textTransform: 'capitalize' }}>
              {source.replace('_', ' ')}
            </Title>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {dates.map((entry) => {
                const busy = scraping === `${source}:${entry.date}`
                return (
                  <div key={entry.date}>
                    {entry.scraped ? (
                      <Tag color="green" style={{ fontSize: 12, padding: '2px 8px' }}>
                        {entry.date}
                      </Tag>
                    ) : (
                      <Button
                        size="small"
                        loading={busy}
                        disabled={!!scraping}
                        onClick={() => handleScrape(source, entry.date)}
                        style={{ fontSize: 12, padding: '2px 8px', height: 'auto' }}
                      >
                        {entry.date}
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
