'use client';

import { useState } from 'react';
import { Modal, Typography, Button, message } from 'antd';
import { HeartOutlined, HeartFilled, LinkOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import FormattedSummary from './FormattedSummary';
import type { Article } from '@/lib/types';

const { Text, Title } = Typography;

const SOURCE_LABEL: Record<string, { label: string; color: string }> = {
  thehindu: { label: 'The Hindu', color: '#3b82f6' },
  indianexpress: { label: 'Indian Express', color: '#f97316' },
  pib: { label: 'PIB', color: '#22c55e' },
};

export default function ArticleModal({ article, onClose }: { article: Article | null; onClose: () => void }) {
  const isMobile = useIsMobile();
  const isLoggedIn = useAuthStore((s) => !!s.accessToken);
  const [bookmarked, setBookmarked] = useState(article?.is_bookmarked ?? false);
  const [toggling, setToggling] = useState(false);

  if (!article) return null;

  const sourceMeta = SOURCE_LABEL[article.source] || { label: article.source, color: '#6366f1' };

  const toggleBookmark = async () => {
    if (!isLoggedIn) {
      message.info('Login to bookmark articles');
      return;
    }
    setToggling(true);
    try {
      const res = await api.toggleBookmark(article.id);
      setBookmarked(res.bookmarked);
    } catch {
      message.error('Failed to toggle bookmark');
    } finally {
      setToggling(false);
    }
  };

  return (
    <Modal
      open={!!article}
      onCancel={onClose}
      footer={null}
      width={isMobile ? 'calc(100% - 16px)' : 700}
      centered
      closable={isMobile}
      style={{ '--ant-modal-content-padding': isMobile ? '12px' : '28px' } as React.CSSProperties}
      styles={{
        body: { maxHeight: isMobile ? '85vh' : undefined, overflowY: 'auto' },
        mask: { backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' },
      }}
    >
      {isMobile && <div style={{ height: 32 }} />}
      {/* Source label + date */}
      <div style={{ marginBottom: isMobile ? 8 : 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: sourceMeta.color,
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <Text
          style={{
            fontSize: isMobile ? 10 : 11,
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: sourceMeta.color,
          }}
        >
          {sourceMeta.label}
        </Text>
        <Text style={{ fontSize: isMobile ? 10 : 11, color: 'var(--color-text-tertiary)' }}>
          {dayjs(article.published_at).format('DD-MM-YYYY')}
        </Text>
        <div style={{ marginLeft: 'auto' }}>
          <Button
            type="text"
            size="small"
            loading={toggling}
            onClick={toggleBookmark}
            icon={
              bookmarked ? (
                <HeartFilled style={{ color: '#ef4444', fontSize: 14 }} />
              ) : (
                <HeartOutlined style={{ color: 'var(--color-text-tertiary)', fontSize: 14 }} />
              )
            }
            style={{ color: bookmarked ? '#ef4444' : 'var(--color-text-tertiary)' }}
          />
        </div>
      </div>

      {/* Thumbnail */}
      {article.image_url && (
        <div
          style={{
            width: '100%',
            maxHeight: isMobile ? 180 : 260,
            overflow: 'hidden',
            marginBottom: isMobile ? 10 : 14,
            background: 'var(--color-surface)',
          }}
        >
          <img
            src={article.image_url}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* Headline */}
      <Title
        level={3}
        style={{
          margin: 0,
          marginBottom: isMobile ? 10 : 14,
          fontSize: isMobile ? 18 : 22,
          fontWeight: 700,
          lineHeight: 1.35,
          color: 'var(--color-text)',
        }}
      >
        {article.headline}
      </Title>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--color-border)', marginBottom: isMobile ? 10 : 14 }} />

      {/* Summary */}
      {article.gk_summary ? (
        <FormattedSummary summary={article.gk_summary} />
      ) : (
        <Text style={{ color: 'var(--color-text-tertiary)', fontSize: 13, fontStyle: 'italic' }}>
          No summary available
        </Text>
      )}

      {/* Divider + link */}
      <div style={{ marginTop: isMobile ? 14 : 20 }}>
        <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 12 }} />
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#6366f1',
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <LinkOutlined />
          Read original article
        </a>
      </div>
    </Modal>
  );
}
