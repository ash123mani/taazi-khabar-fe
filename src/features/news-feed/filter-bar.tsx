'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SearchControl from './search-control';

const SOURCE_META: Record<string, { label: string; color: string }> = {
  all: { label: 'All', color: '#6366f1' },
  thehindu: { label: 'The Hindu', color: '#3b82f6' },
  indianexpress: { label: 'Indian Express', color: '#f97316' },
  pib: { label: 'PIB', color: '#22c55e' },
};

interface FilterBarProps {
  source: string;
  category: string;
  date: string;
  categories: { id: string; name: string }[];
  counts: Record<string, any>;
  filteredCounts: Record<string, any>;
}

export default function FilterBar({
  source: _source,
  category: _category,
  date,
  categories,
  counts,
  filteredCounts,
}: FilterBarProps) {
  const searchParams = useSearchParams();
  const urlSource = searchParams.get('source') || 'all';
  const urlCategory = searchParams.get('category') || 'all';

  const catTotal = filteredCounts?.categories
    ? Object.values(filteredCounts.categories).reduce(
        (a: number, b: any) => a + (b as number),
        0,
      )
    : 0;

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 49,
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border-light)',
        marginBottom: 10,
      }}
    >
      <style>{`
        .filter-link {
          display: inline-block;
          padding: 4px 12px;
          font-size: 13px;
          line-height: 1.5;
          text-decoration: none;
          color: var(--color-text-tertiary);
          border-bottom: 2px solid transparent;
          transition: all 0.15s;
        }
        .filter-link:hover {
          color: var(--color-text);
        }
        .filter-link.active {
          color: var(--color-text);
          font-weight: 700;
          border-bottom-color: var(--color-text);
        }
        .filter-count {
          margin-left: 4px;
          font-size: 10px;
          color: var(--color-text-tertiary);
        }
        .filter-row {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 2px 0;
        }
        @media (max-width: 575px) {
          .filter-link {
            padding: 3px 10px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="filter-row">
        {(['all', 'thehindu', 'indianexpress', 'pib'] as const).map((key) => (
          <Link
            key={key}
            href={`/?source=${key}&date=${date}`}
            className={`filter-link${urlSource === key ? ' active' : ''}`}
          >
            {SOURCE_META[key].label}
            <span className="filter-count">{key === 'all' ? ((counts as any).total ?? 0) : ((counts as any)[key] ?? 0)}</span>
          </Link>
        ))}
      </div>

      {categories.length > 0 && (
        <div className="filter-row">
          <Link
            href={`/?source=${urlSource}&date=${date}`}
            className={`filter-link${urlCategory === 'all' ? ' active' : ''}`}
          >
            All
            <span className="filter-count">{catTotal}</span>
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/?source=${urlSource}&date=${date}&category=${cat.id}`}
              className={`filter-link${urlCategory === cat.id ? ' active' : ''}`}
            >
              {cat.name}
              <span className="filter-count">
                {filteredCounts?.categories?.[cat.id] || 0}
              </span>
            </Link>
          ))}
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--color-border-light)' }}>
        <SearchControl date={date} source={urlSource} />
      </div>
    </div>
  );
}
