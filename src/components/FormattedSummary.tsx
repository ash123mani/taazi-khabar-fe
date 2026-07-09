import { useState } from 'react';
import { Tag } from 'antd';
import {
  BulbOutlined,
  BranchesOutlined,
  BookOutlined,
  ExperimentOutlined,
  TagsOutlined,
  DownOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { ReactNode } from 'react';

interface Section {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  content: string;
}

const SECTION_ALIASES: [string[], string][] = [
  [['gk summary', 'summary', 'event', 'what & why', 'gk gist'], 'summary'],
  [
    [
      'key facts',
      'pointers',
      'prelims focus',
      'gk pointers',
      'key data & facts',
      'people & institutions',
      'why this matters',
    ],
    'pointers',
  ],
  [['analysis', 'mains dimensions', 'law/rule change', 'law & rule change', 'significance'], 'law'],
  [['syllabus tag', 'syllabus topic', 'syllabus', 'why it matters', 'upsc syllabus connect'], 'syllabus'],
  [['interview angle', 'interview'], 'interview'],
  [['category'], 'category'],
  [['key terms', 'terms'], 'terms'],
];

const SECTION_DISPLAY: Record<string, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  summary: { label: 'Summary', icon: <BulbOutlined />, color: '#4f46e5', bgColor: 'rgba(79,70,229,0.04)' },
  pointers: { label: 'Key Facts', icon: <BranchesOutlined />, color: '#d97706', bgColor: 'rgba(217,119,6,0.04)' },
  law: { label: 'Analysis', icon: <ExperimentOutlined />, color: '#0d9488', bgColor: 'rgba(13,148,136,0.04)' },
  syllabus: { label: 'Syllabus', icon: <BookOutlined />, color: '#2563eb', bgColor: 'rgba(37,99,235,0.04)' },
  interview: { label: 'Interview Angle', icon: <BulbOutlined />, color: '#7c3aed', bgColor: 'rgba(124,58,237,0.04)' },
  terms: { label: 'Key Terms', icon: <TagsOutlined />, color: '#ef4444', bgColor: 'rgba(239,68,68,0.04)' },
};

function normalizeHeader(text: string): string {
  return text
    .replace(/^###?\s*/, '')
    .replace(/\*+/g, '')
    .replace(/ —.*$/, '')
    .replace(/ –.*$/, '')
    .trim()
    .toLowerCase();
}

function detectSection(line: string): string | null {
  const lower = line.trim().toLowerCase();
  if (!lower.startsWith('#')) return null;
  const normalized = normalizeHeader(line);
  for (const [aliases, sectionKey] of SECTION_ALIASES) {
    if (aliases.some((a) => normalized === a || normalized.startsWith(a))) return sectionKey;
  }
  return null;
}

const SKIP_SECTIONS = ['category'];
const FOOTER_MARKERS = ['syllabus topic', 'key terms', 'gk gist'];

function isFooterLine(line: string): boolean {
  const lower = line
    .trim()
    .toLowerCase()
    .replace(/^[-•*]\s*/, '');
  return FOOTER_MARKERS.some((m) => lower.startsWith(m));
}

function parseSections(md: string): Section[] {
  const lines = md.split('\n');
  const sections: Section[] = [];
  let currentKey = '';
  let currentLines: string[] = [];

  const flush = () => {
    const content = currentLines.join('\n').trim();
    if (currentKey && content) {
      sections.push({ key: currentKey, content });
    }
    currentLines = [];
  };

  for (const raw of lines) {
    const stripped = raw.trimEnd();
    if (isFooterLine(stripped)) {
      if (currentKey) flush();
      currentKey = '';
      continue;
    }
    const sectionKey = detectSection(stripped);
    if (sectionKey) {
      if (SKIP_SECTIONS.includes(sectionKey)) {
        flush();
        currentKey = '';
        continue;
      }
      flush();
      currentKey = sectionKey;
      const colonIdx = stripped.indexOf(':');
      if (colonIdx > -1) {
        const after = stripped.slice(colonIdx + 1).trim();
        if (after) currentLines.push(after);
      }
      continue;
    }
    if (currentKey && stripped.trim() !== '---') {
      currentLines.push(stripped);
    }
  }
  flush();

  if (sections.length === 0) {
    sections.push({ key: 'summary', content: md });
  }

  const merged: Section[] = [];
  for (const s of sections) {
    const last = merged[merged.length - 1];
    if (last && last.key === s.key) {
      last.content += '\n' + s.content;
    } else {
      merged.push({ ...s });
    }
  }
  return merged;
}

const SECTION_CONFIG: Record<string, { collapsible: boolean; defaultExpanded: boolean }> = {
  summary: { collapsible: true, defaultExpanded: true },
  pointers: { collapsible: true, defaultExpanded: true },
  law: { collapsible: true, defaultExpanded: false },
  interview: { collapsible: true, defaultExpanded: false },
  syllabus: { collapsible: true, defaultExpanded: false },
  terms: { collapsible: false, defaultExpanded: true },
};

function extractText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return extractText((children as any).props.children);
  }
  return '';
}

function renderTerms(text: string) {
  const terms = text
    .split('\n')
    .map((l) =>
      l
        .trim()
        .replace(/^[-•*]\s*/, '')
        .replace(/\*+/g, ''),
    )
    .join(',')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  if (terms.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {terms.map((t) => (
        <Tag key={t} style={{ fontSize: 12, borderRadius: 4, margin: 0, padding: '2px 10px' }}>
          {t}
        </Tag>
      ))}
    </div>
  );
}

function SectionBlock({ section }: { section: Section }) {
  const display = SECTION_DISPLAY[section.key];
  const cfg = SECTION_CONFIG[section.key] || { collapsible: false, defaultExpanded: true };
  const [open, setOpen] = useState(cfg.defaultExpanded);
  const isMobile = useIsMobile();

  if (section.key === 'terms') {
    return (
      <div style={{ borderLeft: `3px solid ${display.color}`, paddingLeft: isMobile ? 8 : 12, marginTop: 8, background: display.bgColor, padding: isMobile ? '6px 8px' : '8px 12px' }}>
        {display && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
            <span style={{ color: display.color, fontSize: isMobile ? 10 : 12 }}>{display.icon}</span>
            <span
              style={{
                fontSize: isMobile ? 10 : 11,
                fontWeight: 600,
                color: display.color,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {display.label}
            </span>
          </div>
        )}
        {renderTerms(section.content)}
      </div>
    );
  }

  const collapsible = cfg.collapsible;
  const bodySize = isMobile ? 15 : 16.5;
  const content = (
    <div
      className="newspaper-body"
      style={{ fontSize: bodySize, lineHeight: 1.8, color: 'var(--color-text-secondary)', maxWidth: 680 }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => {
            const txt = extractText(children);
            if (!txt.trim()) return null;
            return <p style={{ margin: '10px 0' }}>{children}</p>;
          },
          strong: ({ children }) => (
            <strong style={{ fontWeight: 600, color: 'var(--color-text)', opacity: 0.85 }}>{children}</strong>
          ),
          ul: ({ children }) => (
            <ul style={{ paddingLeft: isMobile ? 16 : 20, margin: '6px 0', listStyle: 'none' }}>{children}</ul>
          ),
          li: ({ children }) => (
            <li
              style={{
                marginBottom: 4,
                lineHeight: 1.8,
                fontSize: bodySize,
                padding: '2px 0',
              }}
            >
              {children}
            </li>
          ),
          h3: ({ children }) => {
            const txt = extractText(children).trim().toLowerCase();
            const isSectionHeader = [
              'what & why',
              'key data & facts',
              'people & institutions',
              'why this matters',
              'upsc syllabus connect',
              'gk summary',
              'gk pointers',
              'prelims focus',
              'mains dimensions',
              'interview angle',
              'law/rule change',
              'syllabus tag',
              'gk gist',
            ].some((k) => txt.startsWith(k));
            if (isSectionHeader) return null;
            return (
              <p style={{ margin: '8px 0 4px', fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>
                {children}
              </p>
            );
          },
          h4: ({ children }) => (
            <p style={{ fontSize: 13, fontWeight: 600, margin: '8px 0 4px', color: 'var(--color-text-secondary)' }}>
              {children}
            </p>
          ),
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', margin: '8px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, lineHeight: 1.5 }}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead style={{ background: 'var(--color-surface)' }}>{children}</thead>,
          th: ({ children }) => (
            <th
              style={{
                border: '1px solid var(--color-border)',
                padding: '8px 10px',
                fontWeight: 600,
                color: 'var(--color-text)',
                textAlign: 'left',
                whiteSpace: 'nowrap',
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              style={{
                border: '1px solid var(--color-border)',
                padding: '8px 10px',
                color: 'var(--color-text-secondary)',
              }}
            >
              {children}
            </td>
          ),
        }}
      >
        {section.content}
      </ReactMarkdown>
    </div>
  );

  return (
    <div
      style={{
        borderLeft: `3px solid ${display.color}`,
        paddingLeft: isMobile ? 8 : 12,
        marginTop: isMobile ? 8 : 12,
        background: display.bgColor,
        padding: isMobile ? '6px 8px' : '8px 12px',
      }}
    >
      {display && (
        <div
          onClick={collapsible ? () => setOpen(!open) : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 4,
            cursor: collapsible ? 'pointer' : undefined,
            userSelect: 'none',
          }}
        >
          <span style={{ color: display.color, fontSize: isMobile ? 10 : 11, lineHeight: 1 }}>{display.icon}</span>
          <span
            style={{
              fontSize: isMobile ? 9 : 10,
              fontWeight: 600,
              color: display.color,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {display.label}
          </span>
          {collapsible && (
            <DownOutlined
              style={{
                fontSize: 9,
                color: 'var(--color-text-tertiary)',
                marginLeft: 'auto',
                transition: 'transform 0.2s',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          )}
        </div>
      )}
      {(!collapsible || open) && content}
    </div>
  );
}

const SECTION_ORDER = ['summary', 'pointers', 'law', 'interview', 'syllabus', 'terms'];

export default function FormattedSummary({ summary }: { summary: string }) {
  const sections = parseSections(summary);
  if (sections.length === 0) return null;

  const sorted = [...sections].sort((a, b) => SECTION_ORDER.indexOf(a.key) - SECTION_ORDER.indexOf(b.key));

  return (
    <div>
      {sorted.map((s) => (
        <SectionBlock key={s.key} section={s} />
      ))}
    </div>
  );
}
