'use client'

import { Tag } from 'antd'

const SUBJECT_LABELS: Record<string, string> = {
  Polity: 'P',
  History: 'H',
  Geography: 'G',
  Economy: 'E',
  Environment: 'ENV',
  Science: 'S',
  'Art & Culture': 'AC',
  'Social Issues': 'SI',
  'International Relations': 'IR',
  Ethics: 'ET',
}

export default function SyllabusTag({ tag }: { tag: string | null }) {
  if (!tag) return null
  const subject = tag.split(' > ')[0]
  const label = SUBJECT_LABELS[subject] || subject

  return (
    <Tag style={{ fontSize: 11, borderRadius: 4, margin: 0, background: '#27272a', color: '#d4d4d8', border: '1px solid #3f3f46' }}>
      {label}
    </Tag>
  )
}
