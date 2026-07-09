'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined, LinkOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useIsMobile } from '@/hooks/useIsMobile';
import FormattedSummary from '@/components/FormattedSummary';
import SyllabusTag from '@/app/(public)/_components/SyllabusTag';
import type { Article } from '@/lib/types';

const { Text } = Typography;

const SOURCE_LABEL: Record<string, { label: string; color: string }> = {
  thehindu: { label: 'The Hindu', color: '#3b82f6' },
  indianexpress: { label: 'Indian Express', color: '#f97316' },
  pib: { label: 'PIB', color: '#22c55e' },
};

export default function ArticlePageClient({ article }: { article: Article }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const sourceMeta = SOURCE_LABEL[article.source] || { label: article.source, color: '#6366f1' };

  return (
    <article style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Back button */}
      <div style={{ marginBottom: isMobile ? 16 : 24 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{
            fontSize: 13,
            color: 'var(--color-text-tertiary)',
            padding: 0,
            height: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          Back
        </Button>
      </div>

      {/* Hero Image */}
      {article.image_url && (
        <div
          style={{
            position: 'relative',
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            marginBottom: isMobile ? 16 : 24,
          }}
        >
          <Image
            src={article.image_url}
            alt={article.headline}
            fill
            sizes="(max-width: 720px) 100vw, 720px"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      )}

      {/* Source badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: isMobile ? 8 : 12 }}>
        <span style={{ width: 8, height: 8, background: sourceMeta.color, display: 'inline-block', flexShrink: 0 }} />
        <Text
          style={{
            fontSize: isMobile ? 10 : 11,
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: sourceMeta.color,
          }}
        >
          {sourceMeta.label}
        </Text>
        <Text style={{ fontSize: isMobile ? 9 : 11, color: 'var(--color-text-tertiary)' }}>
          {dayjs(article.published_at).format('DD MMMM YYYY')}
        </Text>
      </div>

      {/* Headline */}
      <h1
        className="newspaper-heading"
        style={{
          fontSize: isMobile ? 24 : 38,
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          color: 'var(--color-text)',
          marginBottom: isMobile ? 16 : 24,
        }}
      >
        {article.headline}
      </h1>

      {/* Syllabus Tag */}
      {article.syllabus_tag && (
        <div style={{ marginBottom: isMobile ? 16 : 24 }}>
          <SyllabusTag tag={article.syllabus_tag} />
        </div>
      )}

      {/* AI Summary */}
      {article.gk_summary && (
        <div style={{ marginBottom: isMobile ? 24 : 32 }}>
          <FormattedSummary summary={article.gk_summary} />
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: isMobile ? 16 : 24,
          marginTop: isMobile ? 24 : 32,
        }}
      >
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Button
            type="default"
            icon={<LinkOutlined />}
            size={isMobile ? 'small' : 'middle'}
            style={{ fontSize: isMobile ? 12 : 13 }}
          >
            Read original article
          </Button>
        </a>
      </div>
    </article>
  );
}
