'use client';

import { useState, useContext } from 'react';
import { Tag, Typography, Button, message, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ArticleModalContext } from './ArticleModalContext';
import SyllabusTag from './SyllabusTag';
import type { Article } from '@/lib/types';

const { Text } = Typography;

const SOURCE_LABEL: Record<string, { label: string; color: string }> = {
  thehindu: { label: 'The Hindu', color: '#3b82f6' },
  indianexpress: { label: 'Indian Express', color: '#f97316' },
  pib: { label: 'PIB', color: '#22c55e' },
};

export default function ArticleCard({ article, onClick }: { article: Article; onClick?: (article: Article) => void }) {
  const [bookmarked, setBookmarked] = useState(article.is_bookmarked ?? false);
  const [toggling, setToggling] = useState(false);
  const isLoggedIn = useAuthStore((s) => !!s.accessToken);
  const isMobile = useIsMobile();
  const modalCtx = useContext(ArticleModalContext);

  const handleClick = () => {
    if (onClick) {
      onClick(article);
    } else if (modalCtx) {
      modalCtx.openArticleModal(article);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const sourceMeta = SOURCE_LABEL[article.source] || { label: article.source, color: '#6366f1' };

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        transition: 'background 0.15s',
        padding: isMobile ? '2px 0 2px 0' : '4px 0 4px 8px',
        marginLeft: isMobile ? 0 : -8,
        borderLeft: isMobile ? 'none' : '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-surface)';
        if (!isMobile) e.currentTarget.style.borderLeftColor = 'var(--color-accent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        if (!isMobile) e.currentTarget.style.borderLeftColor = 'transparent';
      }}
    >
      <div style={{ display: 'flex', gap: isMobile ? 6 : 12, alignItems: 'flex-start' }}>
        {article.image_url && (
          <div
            style={{
              flexShrink: 0,
              width: isMobile ? 48 : 80,
              height: isMobile ? 36 : 60,
              overflow: 'hidden',
              background: 'var(--color-surface)',
            }}
          >
            <img
              src={article.image_url}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Source & date */}
          <div style={{ marginBottom: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 6,
                height: 6,
                background: sourceMeta.color,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <Text
              style={{
                fontSize: isMobile ? 8 : 9,
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: sourceMeta.color,
              }}
            >
              {sourceMeta.label}
            </Text>
            <Text style={{ fontSize: isMobile ? 8 : 9, color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
              {dayjs(article.published_at).format('DD-MM-YYYY')}
            </Text>
          </div>
          {/* Headline */}
          <div
            className="newspaper-heading"
            style={{
              fontSize: isMobile ? 14 : 17,
              fontWeight: 600,
              color: 'var(--color-text)',
              lineHeight: 1.3,
            }}
          >
            {article.headline}
          </div>
          {/* Tags row */}
          {!isMobile && (article.syllabus_tag || article.key_terms?.length) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
              {article.syllabus_tag && <SyllabusTag tag={article.syllabus_tag} />}
              {article.key_terms?.slice(0, 3).map((term) => (
                <Tooltip key={term} title={term}>
                  <Tag
                    style={{
                      fontSize: 8,
                      borderRadius: 0,
                      margin: 0,
                      padding: '0 5px',
                      maxWidth: 90,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {term}
                  </Tag>
                </Tooltip>
              ))}
            </div>
          )}
        </div>
        {/* Bookmark */}
        <div onClick={(e) => e.stopPropagation()} style={{ flexShrink: 0, paddingTop: isMobile ? 0 : 2 }}>
          <Button
            type="text"
            size="small"
            loading={toggling}
            onClick={handleBookmark}
            icon={
              bookmarked ? (
                <HeartFilled style={{ color: '#ef4444', fontSize: 12 }} />
              ) : (
                <HeartOutlined style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }} />
              )
            }
            style={{
              color: bookmarked ? '#ef4444' : 'var(--color-text-tertiary)',
              width: isMobile ? 22 : 26,
              height: isMobile ? 22 : 26,
            }}
          />
        </div>
      </div>
    </div>
  );
}
