# Bulltrack

Classification results dashboard for browsing and filtering bull records. The application consists of a Next.js frontend and a NestJS API backed by PostgreSQL, with JWT authentication, server-side pagination and filtering, and a computed bull score.

**Live demo (mock data):** [https://bulltrackpro-phi.vercel.app/](https://bulltrackpro-phi.vercel.app/) — frontend only, no API or database; uses in-app mock data.

This repository is a pnpm monorepo. Workspace packages are under `apps/`. Install dependencies once from the root with `pnpm install`; that installs for all apps. You can run scripts from the root or from each app directory.

## Repository layout

- **apps/bulltrack-web** – Next.js (App Router) with Tailwind CSS
- **apps/bulltrack-api** – NestJS API with TypeORM and PostgreSQL
- **docs/** – Architecture notes, indexing, and filters (see `docs/` in the repo)

From the repository root you can run: `pnpm run dev:api`, `pnpm run dev:web`, `pnpm run build:api`, `pnpm run build:web`, `pnpm run seed`.

## Prerequisites

- Node.js 20 or later
- pnpm
- Docker (for running PostgreSQL locally)

## Get started

### 1. Database

From the repository root, start PostgreSQL:

```bash
docker compose up -d
```

Default database settings:

- Host: localhost, port 5432
- User: postgres
- Password: postgres
- Database: bulltrack

Wait until the container is healthy (e.g. `docker compose ps` shows the postgres service as healthy) before starting the API.

### 2. Install dependencies

From the repository root:

```bash
pnpm install
```

### 3. API

Copy env and seed the database:

```bash
cp apps/bulltrack-api/.env.example apps/bulltrack-api/.env
```

Edit `apps/bulltrack-api/.env` if your database credentials or ports differ from the defaults. Then, from the root:

```bash
pnpm run seed
pnpm run dev:api
```

Or from the API app directory: `cd apps/bulltrack-api` then `pnpm run seed` and `pnpm run start:dev`.

The API runs at http://localhost:3001. The seed script creates a default user and sample bull records.

Default login (for both API and frontend):

- Email: admin@seed28.com
- Password: seed28

### 4. Frontend

```bash
cp apps/bulltrack-web/.env.example apps/bulltrack-web/.env.local
```

Set in `apps/bulltrack-web/.env.local`:

- `NEXT_PUBLIC_API_URL=http://localhost:3001` (required for real API; no trailing slash)

Optional:

- `NEXT_PUBLIC_USE_MOCK_DATA=true` – use mock data instead of the API (for development without the backend).

From the root:

```bash
pnpm run dev:web
```

Or from the web app directory: `cd apps/bulltrack-web` then `pnpm dev`.

The app is available at http://localhost:3000. Log in with the default credentials above to use the Classification Results dashboard.

## API overview

- **POST /auth/login** – Body: `{ "email", "password" }`. Returns user and sets HTTP-only auth cookies. Use credentials (cookies) for subsequent requests.
- **POST /auth/refresh** – Refresh access using refresh token (cookie or body).
- **GET /auth/me** – Current user (requires auth).
- **POST /auth/logout** – Clear auth cookies.
- **GET /bulls** – Paginated list of bulls (requires auth). Query: `page`, `limit`, `search`, `origen` (propio | catalogo | favoritos), `paraVaquillona` (boolean), `pelaje` (negro | colorado), `sortByScore` (asc | desc).
- **POST /favorites/:bullId** – Add favorite (requires auth).
- **DELETE /favorites/:bullId** – Remove favorite (requires auth).
- **GET /favorites** – List the current user’s favorite bull IDs (requires auth).
- **GET /health** – Health check (no auth).

## Architecture (summary)

- **Frontend:** TanStack Query for server state (bulls, pagination, favorites); React Context for auth (JWT in localStorage and API client) and for filter state (origen, pelaje, para vaquillona, sort by score).
- **Database:** PostgreSQL; TypeORM for entities and migrations. Bull score is computed in the API from stats (e.g. growth, calving ease, reproduction, moderation, carcass) using a weighted formula.
- **Auth:** JWT with Passport; favorites and protected routes are scoped by user ID from the token. The web app can use cookie-based auth (credentials: include) or token from storage depending on configuration.

For more detail, see `docs/backend-architecture.md`, `docs/api-indexing-and-scaling.md`, and `docs/filters-analysis.md`.

## Tests

- **API:** From root run `pnpm --filter bulltrack-api test` (unit) or `pnpm --filter bulltrack-api run test:e2e` (e2e). From `apps/bulltrack-api`: `pnpm test`, `pnpm run test:e2e`.
- **Web:** From root run `pnpm --filter bulltrack-web run lint`. From `apps/bulltrack-web`: `pnpm run lint`.

## Database migrations

Run from `apps/bulltrack-api` (or from root with `pnpm --filter bulltrack-api run migration:run`):

- Apply pending migrations: `pnpm run migration:run`
- Revert last migration: `pnpm run migration:revert`

Migrations are in `apps/bulltrack-api/src/database/migrations/`. In production use migrations only; do not use TypeORM `synchronize`.
