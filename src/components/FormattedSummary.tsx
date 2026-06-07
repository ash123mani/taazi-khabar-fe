import { Collapse, Tag } from 'antd'
import { BulbOutlined, BranchesOutlined, BookOutlined, ExperimentOutlined, TagsOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'

interface Section {
  key: string
  label?: string
  icon?: React.ReactNode
  content: string
  color?: string
}

const SECTION_ALIASES: [string[], string][] = [
  [['gk summary', 'what & why', 'gk gist', 'summary'], 'summary'],
  [['gk pointers', 'key data & facts', 'people & institutions', 'why this matters'], 'pointers'],
  [['law/rule change', 'law & rule change'], 'law'],
  [['syllabus tag', 'upsc syllabus connect', 'syllabus topic', 'syllabus'], 'syllabus'],
  [['key terms'], 'terms'],
]

const SECTION_DISPLAY: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  summary: { label: 'Summary', icon: <BulbOutlined />, color: '#818cf8' },
  pointers: { label: 'Key Facts', icon: <BranchesOutlined />, color: '#10b981' },
  law: { label: 'Law/Rule', icon: <ExperimentOutlined />, color: '#f59e0b' },
  syllabus: { label: 'Syllabus', icon: <BookOutlined />, color: '#a855f7' },
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


function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} style={{ fontWeight: 800, color: '#fafafa' }}>{part.slice(2, -2)}</strong>
        }
        const hasColon = part.includes(':')
        return <span key={i} style={{ fontWeight: hasColon ? 700 : 600, color: '#d4d4d8' }}>{part}</span>
      })}
    </span>
  )
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^#+\s*/, '')
    .replace(/\*+/g, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

const LIST_ITEM_STYLE: React.CSSProperties = {
  marginBottom: 8,
  padding: '6px 14px 6px 16px',
  borderLeft: '4px solid #6366f1',
  lineHeight: 1.7,
  fontSize: 14,
  borderRadius: '0 6px 6px 0',
  background: '#1c1c1f',
}


function getIndentLevel(line: string): number {
  const match = line.match(/^(\s*)/)
  return match ? Math.floor(match[1].length / 2) : 0
}

function renderNestedBullets(lines: string[], defaultExpanded?: string) {
  const groups: { main: string; subs: string[] }[] = []
  let currentGroup: string[] = []
  let currentIndent = 0

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const trimmed = raw.trim()
    if (!trimmed || trimmed === '---') continue

    const indent = getIndentLevel(raw)
    const text = trimmed.replace(/^[-•*]\s*/, '').trim()
    if (!text) continue

    if (indent === 0) {
      if (currentGroup.length > 0) {
        groups.push({ main: currentGroup[0], subs: currentGroup.slice(1) })
        currentGroup = []
      }
      currentGroup = [text]
      currentIndent = 0
    } else {
      currentGroup.push(text)
      currentIndent = indent
    }
  }
  if (currentGroup.length > 0) {
    groups.push({ main: currentGroup[0], subs: currentGroup.slice(1) })
  }

  if (defaultExpanded) {
    const defaultKey = defaultExpanded.toLowerCase().replace(/[*:]/g, '').trim()
    const items = groups.map((g) => ({
      key: g.main.slice(0, 30),
      label: (
        <span style={{ fontSize: 14, fontWeight: 700, color: '#fafafa' }}>
          <InlineMarkdown text={g.main} />
        </span>
      ),
      children: g.subs.length > 0 ? (
        <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
          {g.subs.map((sub, j) => (
            <li key={j} style={{
              marginBottom: 6,
              padding: '4px 10px 4px 12px',
              borderLeft: '4px solid #6366f1',
              lineHeight: 1.6,
              fontSize: 13,
              color: '#d4d4d8',
              background: '#141416',
            }}>
              <InlineMarkdown text={sub} />
            </li>
          ))}
        </ul>
      ) : null,
    }))
    const activeKey = items.find((item) => {
      const label = item.key.replace(/[*:]/g, '').trim().toLowerCase()
      return label.startsWith(defaultKey) || defaultKey.startsWith(label) || label.includes(defaultKey)
    })?.key
    return (
      <Collapse ghost size="small" items={items} defaultActiveKey={activeKey ? [activeKey] : []} expandIconPosition="end" style={{ marginTop: 4 }} />
    )
  }

  const rootItems = groups.map((g) => renderSingleBullet([g.main, ...g.subs], 0))
  return (
    <ul style={{ padding: 0, margin: '6px 0', listStyle: 'none' }}>
      {rootItems}
    </ul>
  )
}

function renderSingleBullet(lines: string[], indent: number): React.ReactNode {
  const mainText = lines[0]
  const subItems = lines.slice(1)

    return (
    <li key={mainText.slice(0, 20)} style={{
      ...LIST_ITEM_STYLE,
      background: '#1c1c1f',
      marginBottom: 10,
    }}>
      <InlineMarkdown text={mainText} />
      {subItems.length > 0 && (
        <ul style={{ padding: '6px 0 0 14px', margin: 0, listStyle: 'none' }}>
          {subItems.map((sub, j) => (
            <li key={j} style={{
              marginBottom: 8,
              padding: '5px 12px 5px 14px',
              borderLeft: '4px solid #6366f1',
              lineHeight: 1.7,
              fontSize: 14,
              color: '#d4d4d8',
              background: '#141416',
            }}>
              <InlineMarkdown text={sub} />
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function renderBoldLines(lines: string[]) {
  return (
    <ul style={{ padding: 0, margin: '6px 0', listStyle: 'none' }}>
      {lines.map((line, i) => {
        const text = line.trim()
        if (!text) return null
        return (
          <li key={i} style={{
            ...LIST_ITEM_STYLE,
            background: i % 2 === 0 ? '#1c1c1f' : '#141416',
          }}>
            <InlineMarkdown text={text} />
          </li>
        )
      })}
    </ul>
  )
}

function renderMarkdown(text: string, defaultExpanded?: string) {
  const lines = text.split('\n')

  const bulletLines = lines.filter((l) => /^[-•*]\s/.test(l.trim()))
  if (bulletLines.length >= 2) {
    return renderNestedBullets(lines, defaultExpanded)
  }

  const boldStartLines = lines.filter((l) => /^\*\*[^*]+\*\*/.test(l.trim()))
  if (boldStartLines.length >= 2) {
    return renderBoldLines(lines)
  }

  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => {
          const txt = stripMarkdown(String(children))
          const hasBold = /\*\*/.test(String(children))
          if (txt.length > 60) {
            return <p style={{ margin: '4px 0', lineHeight: 1.6, fontSize: 13, color: '#a1a1aa', fontWeight: hasBold ? 500 : 400 }}>{txt}</p>
          }
          return <p style={{ margin: '4px 0', lineHeight: 1.6, fontSize: 13, color: '#d4d4d8', fontWeight: txt.includes(':') ? 600 : 500 }}>{txt}</p>
        },
        h3: ({ children }) => {
          const txt = stripMarkdown(String(children)).toLowerCase()
          const isSectionHeader = Object.values(SECTION_DISPLAY).some((d) => d.label.toLowerCase() === txt) ||
            ['what & why', 'key data & facts', 'people & institutions', 'why this matters', 'upsc syllabus connect',
              'gk summary', 'gk pointers', 'law/rule change', 'syllabus tag', 'key terms'].some((k) => txt.startsWith(k))
          if (isSectionHeader) return null
          return <p style={{ margin: '6px 0 2px', fontWeight: 600, fontSize: 13, color: '#d4d4d8' }}>{stripMarkdown(String(children))}</p>
        },
        strong: ({ children }) => <strong style={{ fontWeight: 600, color: '#fafafa' }}>{children}</strong>,
        ul: ({ children }) => <ul style={{ paddingLeft: 16, margin: '4px 0', listStyle: 'none' }}>{children}</ul>,
        li: ({ children }) => (
          <li style={{
            ...LIST_ITEM_STYLE,
            background: '#1c1c1f',
          }}>
            {children}
          </li>
        ),
        p: ({ children }) => {
          const txt = stripMarkdown(String(children))
          if (!txt) return null
          return <p style={{ margin: '4px 0', lineHeight: 1.6, fontSize: 13, color: '#a1a1aa' }}>{txt}</p>
        },
        h4: ({ children }) => {
          const txt = stripMarkdown(String(children))
          return <p style={{ fontSize: 12, fontWeight: 600, margin: '6px 0 2px', color: '#a1a1aa' }}>{txt}</p>
        },
        table: ({ children }) => (
          <div style={{ overflowX: 'auto', margin: '6px 0', border: '1px solid #27272a', borderRadius: 4 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>{children}</table>
          </div>
        ),
        th: ({ children }) => <th style={{ background: '#1c1c1f', padding: '4px 8px', borderBottom: '2px solid #27272a', fontWeight: 600, textAlign: 'left', fontSize: 12, color: '#fafafa' }}>{children}</th>,
        td: ({ children }) => <td style={{ padding: '4px 8px', borderBottom: '1px solid #27272a', fontSize: 12, color: '#d4d4d8' }}>{children}</td>,
      }}
    >
      {text}
    </ReactMarkdown>
  )
}

function renderContent(text: string, sectionKey: string, defaultExpanded?: string) {
  if (sectionKey === 'terms') {
    const terms = text.split('\n').map((l) => l.trim().replace(/^[-•*]\s*/, '').replace(/\*+/g, '')).join(',').split(',').map((t) => t.trim()).filter(Boolean)
    if (terms.length === 0) return null
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {terms.map((t) => (
          <Tag key={t} style={{ fontSize: 11, borderRadius: 4, margin: 0, background: '#27272a', color: '#a1a1aa', border: '1px solid #3f3f46' }}>{t}</Tag>
        ))}
      </div>
    )
  }
  return renderMarkdown(text, defaultExpanded)
}


export default function FormattedSummary({ summary, compact, defaultExpanded }: { summary: string; compact?: boolean; defaultExpanded?: string }) {
  const sections = parseSections(summary)
  if (sections.length === 0) return null

  const firstSection = sections[0]
  const restSections = sections.slice(1)

  const collapseItems = restSections.map((s) => {
    const display = SECTION_DISPLAY[s.key] || SECTION_DISPLAY.summary
    return {
      key: s.key,
      label: (
        <span style={{ fontSize: 12, fontWeight: 600, color: display.color, display: 'flex', alignItems: 'center', gap: 5 }}>
          {display.icon}
          {display.label}
        </span>
      ),
      children: (
        <div style={{ fontSize: 13, lineHeight: 1.6, color: '#a1a1aa', paddingTop: 2 }}>
          {renderContent(s.content, s.key)}
        </div>
      ),
    }
  })

  return (
    <div>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: '#d4d4d8' }}>
        {renderContent(firstSection.content, firstSection.key, defaultExpanded)}
      </div>
      {!compact && collapseItems.length > 0 && (
        <Collapse
          ghost
          size="small"
          items={collapseItems}
          style={{ marginTop: 8 }}
          expandIconPosition="end"
        />
      )}
    </div>
  )
}
