'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Input, Tabs } from 'antd';
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
  onSourceChange: (key: string) => void;
  onCategoryChange: (key: string) => void;
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
  onSourceChange,
  onCategoryChange,
}: FilterBarProps) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();

  const prefetchOnHover = useCallback(
    (overrides: { source?: string; category?: string }) => {
      router.prefetch(buildUrl(pathname, { date, source, search, ...overrides }));
    },
    [router, pathname, date, source, search],
  );

  const tabLabel = (label: string, count: React.ReactNode) => (
    <span style={{ fontSize: isMobile ? 12 : 13 }}>
      {label}
      {count != null && (
        <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--color-text-tertiary)' }}>{count}</span>
      )}
    </span>
  );

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
      {/* Source tabs */}
      <Tabs
        activeKey={source}
        onChange={onSourceChange}
        items={SOURCE_KEYS.map((key) => ({
          key,
          label: (
            <span onMouseEnter={() => prefetchOnHover({ source: key })}>
              {tabLabel(SOURCE_META[key].label, (counts as any)[key])}
            </span>
          ),
        }))}
        size="small"
        style={{ marginBottom: 0 }}
        tabBarStyle={{ marginBottom: 0, borderBottom: 'none' }}
      />

      {/* Category tabs */}
      {categories.length > 0 && (
        <Tabs
          activeKey={category}
          onChange={onCategoryChange}
          items={[
            {
              key: 'all',
              label: (
                <span onMouseEnter={() => prefetchOnHover({})}>
                  {tabLabel('All', `(${catTotal})`)}
                </span>
              ),
            },
            ...categories.map((c) => ({
              key: c.id,
              label: (
                <span onMouseEnter={() => prefetchOnHover({ category: c.id })}>
                  {tabLabel(c.name, `(${filteredCounts?.categories?.[c.id] || 0})`)}
                </span>
              ),
            })),
          ]}
          size="small"
          style={{ marginBottom: 0 }}
          tabBarStyle={{ marginBottom: 0, borderBottom: 'none' }}
        />
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
