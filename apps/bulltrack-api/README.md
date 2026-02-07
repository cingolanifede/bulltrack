# Bulltrack API

NestJS backend for the Bulltrack classification results dashboard. Provides JWT-authenticated REST endpoints for users, bulls (with pagination and filters), and favorites. Uses TypeORM with PostgreSQL.

This app is part of the Bulltrack monorepo. For full setup (database, seed, and run order), see the root [README](../../README.md). You can install dependencies from the repo root with `pnpm install` or from this directory.

## Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL (e.g. via `docker compose up -d` from the repo root)

## Setup

Copy env and edit as needed:

```bash
cp .env.example .env
```

Edit `.env` to match your database and environment. Main variables:

- **DB_HOST**, **DB_PORT**, **DB_USERNAME**, **DB_PASSWORD**, **DB_DATABASE** – PostgreSQL connection (defaults work with the root `docker compose` stack).
- **JWT_SECRET** – Secret for signing JWTs (use a strong value in production).
- **JWT_EXPIRES_IN** – Access token lifetime (e.g. `1d`).
- **PORT** – API port (default 3001).
- **CORS_ORIGIN** – Allowed origins, comma-separated (e.g. `http://localhost:3000` for the Next.js dev server).

## Seed data

Creates a default user and sample bulls:

```bash
pnpm run seed
```

Default user: `admin@seed28.com` / `seed28`.

## Run

```bash
# Development (watch mode)
pnpm run start:dev

# Production build and run
pnpm run build
pnpm run start:prod
```

API base URL in development: http://localhost:3001. From the repo root you can run `pnpm run dev:api` instead of `pnpm run start:dev` here.

## Main endpoints

- **POST /auth/login** – Login with email/password; returns user and sets auth cookies.
- **POST /auth/refresh** – Refresh tokens (cookie or body).
- **GET /auth/me** – Current user (auth required).
- **POST /auth/logout** – Clear auth cookies.
- **GET /bulls** – Paginated bulls (auth required). Query params: `page`, `limit`, `search`, `origen`, `paraVaquillona`, `pelaje`, `sortByScore`.
- **POST /favorites/:bullId** – Add favorite (auth required).
- **DELETE /favorites/:bullId** – Remove favorite (auth required).
- **GET /favorites** – List current user’s favorite bull IDs (auth required).
- **GET /health** – Health check (no auth).

## Tests

Unit tests cover controllers, services, JWT guard, and JWT strategy (mocked dependencies; no DB). E2E tests hit the real app and DB.

```bash
pnpm test           # Unit tests (test/unit/**/*.spec.ts)
pnpm run test:e2e   # E2E tests (test/*.e2e-spec.ts)
pnpm run test:cov   # Unit tests with coverage report
```

## Migrations

Migrations live in `src/database/migrations/`.

```bash
pnpm run migration:run    # Apply pending migrations
pnpm run migration:revert # Revert last migration
```

Build is required before running migrations (`migration:run` runs `nest build` first).
