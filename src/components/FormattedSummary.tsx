import ReactMarkdown from 'react-markdown'

export default function FormattedSummary({ summary }: { summary: string }) {
  return (
    <ReactMarkdown
      components={{
        strong: ({ children }) => <strong>{children}</strong>,
        ul: ({ children }) => <ul style={{ paddingLeft: 20, margin: '4px 0' }}>{children}</ul>,
        li: ({ children }) => <li style={{ marginBottom: 2 }}>{children}</li>,
        h3: ({ children }) => <h3 style={{ fontSize: 14, margin: '8px 0 4px', fontWeight: 600 }}>{children}</h3>,
        p: ({ children }) => <p style={{ margin: '4px 0' }}>{children}</p>,
      }}
    >
      {summary}
    </ReactMarkdown>
  )
}
