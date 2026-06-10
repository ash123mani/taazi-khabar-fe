import { Tag } from 'antd'
import { BulbOutlined, BranchesOutlined, BookOutlined, ExperimentOutlined, TagsOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'

interface Section {
  key: string
  label?: string
  icon?: React.ReactNode
  content: string
}

const SECTION_ALIASES: [string[], string][] = [
  [['event', 'gk summary', 'what & why', 'gk gist', 'summary'], 'summary'],
  [['key actors', 'gk pointers', 'key data & facts', 'people & institutions', 'why this matters', 'prelims focus'], 'pointers'],
  [['significance', 'analysis', 'law/rule change', 'law & rule change', 'mains dimensions'], 'law'],
  [['why it matters', 'syllabus tag', 'upsc syllabus connect', 'syllabus topic', 'syllabus'], 'syllabus'],
  [['interview angle'], 'interview'],
  [['key terms'], 'terms'],
]

const SECTION_DISPLAY: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  summary: { label: 'Summary', icon: <BulbOutlined />, color: '#6366f1' },
  pointers: { label: 'Key Facts', icon: <BranchesOutlined />, color: '#22c55e' },
  law: { label: 'Analysis', icon: <ExperimentOutlined />, color: '#eab308' },
  syllabus: { label: 'Syllabus', icon: <BookOutlined />, color: '#a855f7' },
  interview: { label: 'Interview Angle', icon: <BulbOutlined />, color: '#06b6d4' },
  terms: { label: 'Key Terms', icon: <TagsOutlined />, color: '#ef4444' },
}

function normalizeHeader(text: string): string {
  return text
    .replace(/^###?\s*/, '')
    .replace(/\*+/g, '')
    .replace(/ —.*$/, '')
    .replace(/ –.*$/, '')
    .trim()
    .toLowerCase()
}

function detectSection(line: string): string | null {
  const lower = line.trim().toLowerCase()
  if (!lower.startsWith('#')) return null
  const normalized = normalizeHeader(line)
  for (const [aliases, sectionKey] of SECTION_ALIASES) {
    if (aliases.some((a) => normalized === a || normalized.startsWith(a))) return sectionKey
  }
  return null
}

const FOOTER_MARKERS = ['syllabus topic', 'key terms', 'gk gist']

function isFooterLine(line: string): boolean {
  const lower = line.trim().toLowerCase().replace(/^[-•*]\s*/, '')
  return FOOTER_MARKERS.some((m) => lower.startsWith(m))
}

function parseSections(md: string): Section[] {
  const lines = md.split('\n')
  const sections: Section[] = []
  let currentKey = ''
  let currentLines: string[] = []

  const flush = () => {
    const content = currentLines.join('\n').trim()
    if (currentKey && content) {
      sections.push({ key: currentKey, content })
    }
    currentLines = []
  }

  for (const raw of lines) {
    const stripped = raw.trimEnd()
    if (isFooterLine(stripped)) {
      if (currentKey) flush()
      currentKey = ''
      continue
    }
    const sectionKey = detectSection(stripped)
    if (sectionKey) {
      flush()
      currentKey = sectionKey
      continue
    }
    if (currentKey && stripped.trim() !== '---') {
      currentLines.push(stripped)
    }
  }
  flush()

  if (sections.length === 0) {
    sections.push({ key: 'summary', content: md })
  }

  const merged: Section[] = []
  for (const s of sections) {
    const last = merged[merged.length - 1]
    if (last && last.key === s.key) {
      last.content += '\n' + s.content
    } else {
      merged.push({ ...s })
    }
  }
  return merged
}

function renderTerms(text: string) {
  const terms = text
    .split('\n')
    .map((l) => l.trim().replace(/^[-•*]\s*/, '').replace(/\*+/g, ''))
    .join(',')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  if (terms.length === 0) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {terms.map((t) => (
        <Tag key={t} style={{ fontSize: 12, borderRadius: 4, margin: 0, padding: '2px 10px', background: '#0f0f0f', color: '#a1a1a1', border: '1px solid #1f1f1f' }}>{t}</Tag>
      ))}
    </div>
  )
}

function SectionBlock({ section }: { section: Section }) {
  const display = SECTION_DISPLAY[section.key]

  if (section.key === 'terms') {
    return (
      <div style={{ borderLeft: '2px solid #1f1f1f', paddingLeft: 14, marginTop: 16 }}>
        {display && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
            <span style={{ color: '#6366f1', fontSize: 12 }}>{display.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#6366f1', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {display.label}
            </span>
          </div>
        )}
        {renderTerms(section.content)}
      </div>
    )
  }

  return (
    <div style={{ borderLeft: '2px solid #1f1f1f', paddingLeft: 14, marginTop: 16 }}>
      {display && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <span style={{ color: '#6366f1', fontSize: 12 }}>{display.icon}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#6366f1', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {display.label}
          </span>
        </div>
      )}
      <div style={{ fontSize: 14, lineHeight: 1.7, color: '#a1a1a1' }}>
        <ReactMarkdown
          components={{
            p: ({ children }) => {
              const txt = String(children)
              if (!txt.trim()) return null
              return <p style={{ margin: '4px 0' }}>{children}</p>
            },
            strong: ({ children }) => <strong style={{ fontWeight: 600, color: '#e5e5e5' }}>{children}</strong>,
            ul: ({ children }) => <ul style={{ paddingLeft: 16, margin: '4px 0', listStyle: 'none' }}>{children}</ul>,
            li: ({ children }) => (
              <li style={{
                marginBottom: 6,
                padding: '8px 12px',
                background: '#0f0f0f',
                borderRadius: 6,
                lineHeight: 1.6,
                fontSize: 14,
              }}>
                {children}
              </li>
            ),
            h3: ({ children }) => {
              const txt = String(children).replace(/\*+/g, '').trim().toLowerCase()
              const isSectionHeader = ['what & why', 'key data & facts', 'people & institutions', 'why this matters',
                'upsc syllabus connect', 'gk summary', 'gk pointers', 'prelims focus', 'mains dimensions',
                'interview angle', 'law/rule change', 'syllabus tag', 'gk gist'].some((k) => txt.startsWith(k))
              if (isSectionHeader) return null
              return <p style={{ margin: '8px 0 4px', fontWeight: 600, fontSize: 14, color: '#c5c5c5' }}>{String(children).replace(/\*+/g, '')}</p>
            },
            h4: ({ children }) => <p style={{ fontSize: 13, fontWeight: 600, margin: '8px 0 4px', color: '#b0b0b0' }}>{String(children).replace(/\*+/g, '')}</p>,
          }}
        >
          {section.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default function FormattedSummary({ summary }: { summary: string; compact?: boolean; defaultExpanded?: string }) {
  const sections = parseSections(summary)
  if (sections.length === 0) return null

  return (
    <div>
      {sections.map((s) => (
        <SectionBlock key={s.key} section={s} />
      ))}
    </div>
  )
}
