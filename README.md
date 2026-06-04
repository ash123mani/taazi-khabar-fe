# taazi-khabar-frontend

AI-powered UPSC current affairs platform — frontend.

Built with Next.js 14, Ant Design 6, Zustand, React Query.

## Prerequisites

- Node.js 18+
- Backend running at `http://localhost:8000`

## Local Setup

```bash
# 1. Environment
cp .env.example .env

# Ensure NEXT_PUBLIC_API_URL includes /api:
#   NEXT_PUBLIC_API_URL=http://localhost:8000/api

# 2. Install dependencies
npm install

# 3. Run
npm run dev
```

Opens at `http://localhost:3000`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint |
| `npm test` | Run tests |

## Project Structure

```
src/
├── app/          — Next.js pages (feed, quiz, history, admin, auth)
├── components/   — UI components (ArticleCard, Navbar, ThemeProvider, etc.)
├── hooks/        — React Query hooks (useArticles, useQuizzes, etc.)
├── lib/          — API client, types, auth config
└── stores/       — Zustand stores (auth, UI/theme)
```
