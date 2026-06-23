'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useIsMobile } from '@/hooks/useIsMobile';

const SOURCE_META: Record<string, { label: string; color: string }> = {
  all: { label: 'All', color: '#6366f1' },
  thehindu: { label: 'The Hindu', color: '#3b82f6' },
  indianexpress: { label: 'Indian Express', color: '#f97316' },
  pib: { label: 'PIB', color: '#22c55e' },
};

const SOURCE_KEYS = ['all', 'thehindu', 'indianexpress', 'pib'] as const;

function buildUrl(
  pathname: string,
  overrides: { date?: string; source?: string; category?: string; search?: string },
) {
  const params = new URLSearchParams();
  if (overrides.date) params.set('date', overrides.date);
  if (overrides.source && overrides.source !== 'all') params.set('source', overrides.source);
  if (overrides.category && overrides.category !== 'all') params.set('category', overrides.category);
  if (overrides.search) params.set('search', overrides.search);
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

interface FilterBarProps {
  date: string;
  source: string;
  category: string;
  search: string;
  categories: { id: string; name: string }[];
  counts: Record<string, any>;
  catTotal: number;
  filteredCounts: Record<string, any>;
  searchInput: string;
  onSearchInputChange: (val: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export default function FilterBar({
  date,
  source,
  category,
  search,
  categories,
  counts,
  catTotal,
  filteredCounts,
  searchInput,
  onSearchInputChange,
  onSearch,
  onClear,
}: FilterBarProps) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const linkStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 12px',
    fontSize: isMobile ? 12 : 13,
    fontWeight: 400,
    color: 'var(--color-text-tertiary)',
    textDecoration: 'none',
    borderBottom: '2px solid transparent',
    transition: 'all 0.15s',
  };
  const activeLinkStyle: React.CSSProperties = {
    ...linkStyle,
    color: 'var(--color-text)',
    fontWeight: 700,
    borderBottomColor: 'var(--color-accent)',
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 49,
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border-light)',
        marginBottom: isMobile ? 6 : 10,
      }}
    >
      {/* Source links */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '0 4px' }}>
        {SOURCE_KEYS.map((key) => {
          const active = source === key;
          return (
            <Link
              key={key}
              href={buildUrl(pathname, { date, source: key, search })}
              prefetch={true}
              style={active ? activeLinkStyle : linkStyle}
            >
              {SOURCE_META[key].label}
              {(counts as any)[key] != null && (
                <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
                  {(counts as any)[key]}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Category links */}
      {categories.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            padding: '0 4px',
            borderTop: '1px solid var(--color-border-light)',
          }}
        >
          <Link
            key="all"
            href={buildUrl(pathname, { date, source, search })}
            prefetch={true}
            style={category === 'all' ? activeLinkStyle : linkStyle}
          >
            All
            <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>({catTotal})</span>
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={buildUrl(pathname, { date, source, category: c.id, search })}
              prefetch={true}
              style={category === c.id ? activeLinkStyle : linkStyle}
            >
              {c.name}
              <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
                ({filteredCounts?.categories?.[c.id] || 0})
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Search */}
      <div
        style={{
          borderTop: '1px solid var(--color-border-light)',
          padding: '2px 0',
        }}
      >
        <Input.Search
          placeholder="Search articles..."
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          onSearch={onSearch}
          onClear={onClear}
          allowClear
          size="small"
          variant="borderless"
          prefix={<SearchOutlined style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }} />}
          style={{ height: isMobile ? 30 : 34 }}
        />
      </div>
    </div>
  );
}
