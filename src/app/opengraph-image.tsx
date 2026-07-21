import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-1px',
            marginBottom: 16,
          }}
        >
          Taazi Khabar
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#6366f1',
            fontWeight: 600,
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          UPSC Current Affairs
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 18,
            color: '#a1a1a1',
            maxWidth: 600,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          AI-powered daily news analysis, quizzes, and personalized learning
          for competitive exams
        </div>
      </div>
    ),
    size,
  )
}
