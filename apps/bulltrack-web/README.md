# Bulltrack Web

Next.js frontend for the Bulltrack classification results dashboard. App Router, Tailwind CSS, TanStack Query for server state, and React Context for auth and filters. Connects to the Bulltrack API for bulls list, pagination, filtering, and favorites.

This app is part of the Bulltrack monorepo. For full setup (database, API, and run order), see the root [README](../../README.md). You can install dependencies from the repo root with `pnpm install` or from this directory.

## Prerequisites

- Node.js 20+
- pnpm
- Bulltrack API running (or mock mode; see below)

## Setup

Copy env and configure:

```bash
cp .env.example .env.local
```

Configure `.env.local`:

- **NEXT_PUBLIC_API_URL** – API base URL with no trailing slash (e.g. `http://localhost:3001`). Required when not using mock data.
- **NEXT_PUBLIC_USE_MOCK_DATA** – Set to `true` to use mock data instead of the API (optional, for local UI work without the backend).

## Run

```bash
pnpm dev
```

App URL: http://localhost:3000. From the repo root you can run `pnpm run dev:web` instead.

Production build:

```bash
pnpm build
pnpm start
```

## Default login

When using the real API with seeded data: `admin@seed28.com` / `seed28`.

## Project structure

- **app/** – App Router pages: login, dashboard layout, classification results.
- **components/** – Reusable UI (atoms, molecules, organisms) and providers.
- **hooks/** – Data and page logic (e.g. bulls, favorites, classification results).
- **lib/** – API client, auth context, filters context, types, and helpers.

The app uses cookie-based or token-based auth against the API depending on configuration; the API client sends credentials so cookies are used when the API sets them.
