import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: '#0f172a', card: '#1e293b', border: '#334155' },
        accent: { DEFAULT: '#22d3ee', hover: '#06b6d4' },
        text: { primary: '#f8fafc', secondary: '#cbd5e1', muted: '#64748b' },
      },
    },
  },
  plugins: [],
}
export default config
