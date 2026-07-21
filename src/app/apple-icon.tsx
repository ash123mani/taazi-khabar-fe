import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#6366f1',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 64,
          fontWeight: 800,
          color: '#ffffff',
        }}
      >
        TK
      </div>
    ),
    size,
  )
}
