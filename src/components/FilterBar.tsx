'use client';

import { Input, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useIsMobile } from '@/hooks/useIsMobile';

const SOURCE_META: Record<string, { label: string; color: string }> = {
  all: { label: 'All', color: '#6366f1' },
  thehindu: { label: 'The Hindu', color: '#3b82f6' },
  indianexpress: { label: 'Indian Express', color: '#f97316' },
  pib: { label: 'PIB', color: '#22c55e' },
};

interface FilterBarProps {
  sourceFilter: string;
  onSourceChange: (key: string) => void;
  categories: { id: string; name: string }[];
  categoryFilter: string;
  onCategoryChange: (key: string) => void;
  counts: Record<string, any>;
  catTotal: number;
  filteredCounts: Record<string, any>;
  searchInput: string;
  onSearchInputChange: (val: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export default function FilterBar({
  sourceFilter,
  onSourceChange,
  categories,
  categoryFilter,
  onCategoryChange,
  counts,
  catTotal,
  filteredCounts,
  searchInput,
  onSearchInputChange,
  onSearch,
  onClear,
}: FilterBarProps) {
  const isMobile = useIsMobile();

  const tabItems = [
    {
      key: 'all',
      label: (
        <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: categoryFilter === 'all' ? 700 : 400 }}>
          All
          <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--color-text-tertiary)' }}>({catTotal})</span>
        </span>
      ),
    },
    ...categories.map((c) => ({
      key: c.id,
      label: (
        <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: categoryFilter === c.id ? 700 : 400 }}>
          {c.name}
          <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--color-text-tertiary)' }}>
            ({filteredCounts?.categories?.[c.id] || 0})
          </span>
        </span>
      ),
    })),
  ];

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
        activeKey={sourceFilter}
        onChange={onSourceChange}
        items={(['all', 'thehindu', 'indianexpress', 'pib'] as const).map((key) => ({
          key,
          label: (
            <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: sourceFilter === key ? 700 : 400 }}>
              {SOURCE_META[key].label}
              {(counts as any)[key] != null && (
                <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--color-text-tertiary)' }}>
                  {(counts as any)[key]}
                </span>
              )}
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
          activeKey={categoryFilter}
          onChange={onCategoryChange}
          items={tabItems}
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
