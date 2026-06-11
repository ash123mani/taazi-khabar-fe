'use client'

import { Tag, Tooltip } from 'antd'

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
    <Tooltip title={tag}>
      <Tag style={{ fontSize: 11, borderRadius: 4, margin: 0, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </Tag>
    </Tooltip>
  )
}
