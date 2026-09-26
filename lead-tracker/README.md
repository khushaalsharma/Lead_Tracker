# Lead Tracker

A simple full-stack Lead Tracker application — create, list, search, and
update the status of sales leads.

- **Frontend:** React + TypeScript (Vite)
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL

## Features

- Create a lead (name, email, phone)
- List all leads
- Search leads by name, email, phone, or status
- Update a lead's status (`NEW` → `CONTACTED` → `QUALIFIED` → `WON`/`LOST`)

## Architecture

```
lead-tracker/
├── backend/                 # Express + TypeScript API
│   ├── src/
│   │   ├── config/db.ts     # PostgreSQL connection pool
│   │   ├── models/lead.ts   # Data access layer (SQL queries)
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # Express route definitions
│   │   ├── middleware/      # Input validation
│   │   ├── app.ts           # Express app (middleware, routes, error handling)
│   │   └── server.ts        # Entry point
│   ├── migrations/          # SQL schema migrations
│   ├── scripts/migrate.ts   # Migration runner
│   └── tests/               # Jest + Supertest tests
├── frontend/                 # React + TypeScript (Vite) SPA
│   └── src/
│       ├── api/leadApi.ts   # Typed fetch client
│       ├── types/lead.ts    # Shared TypeScript types
│       └── components/      # LeadForm, LeadList, LeadSearch, StatusBadge
├── docker-compose.yml        # Local PostgreSQL for development
└── AGENT.md                  # AI usage documentation
```

**Request flow:** `React UI → fetch (leadApi.ts) → Express routes →
controllers → model (parameterized SQL) → PostgreSQL`.

**Data model** (`leads` table):

| Column     | Type                         |
|------------|-------------------------------|
| id         | UUID (primary key)            |
| name       | VARCHAR(255)                  |
| email      | VARCHAR(255)                  |
| phone      | VARCHAR(50)                   |
| status     | ENUM (NEW, CONTACTED, QUALIFIED, LOST, WON) |
| created_at | TIMESTAMPTZ (default now())   |

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker, to run it locally via `docker-compose`)

### 1. Database

Using Docker (recommended for local dev):

```bash
docker-compose up -d
```

This starts PostgreSQL on `localhost:5432` with database `lead_tracker`,
user `postgres`, password `postgres` (see `docker-compose.yml`).

If you're using an existing PostgreSQL instance instead, just create a
database and point `DATABASE_URL` at it (step 2).

### 2. Backend

```bash
cd backend
cp .env.example .env    # edit DATABASE_URL if needed
npm install
npm run migrate         # applies migrations/001_create_leads_table.sql
npm run dev              # starts the API on http://localhost:4000
```

Run the tests:

```bash
npm test
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env    # edit VITE_API_BASE_URL if needed
npm install
npm run dev              # starts the UI on http://localhost:5173
```

Open `http://localhost:5173` in your browser. The dev server proxies API
calls to `http://localhost:4000/api` by default (configurable via
`VITE_API_BASE_URL`).

## API Reference

| Method | Endpoint                    | Description                          |
|--------|------------------------------|---------------------------------------|
| GET    | `/api/leads`                 | List all leads                        |
| GET    | `/api/leads?q=<term>`        | Search leads by name/email/phone/status |
| GET    | `/api/leads/:id`             | Get a single lead                     |
| POST   | `/api/leads`                 | Create a lead (`name`, `email`, `phone`) |
| PATCH  | `/api/leads/:id/status`      | Update a lead's status (`status`)     |
| GET    | `/health`                    | Health check                          |

## Deployment Steps

**Backend** (e.g. Render, Railway, Fly.io, or any Node host):

1. Provision a managed PostgreSQL instance and note its connection string.
2. Set environment variables: `DATABASE_URL`, `PORT`, `CORS_ORIGIN` (set to
   the deployed frontend's URL).
3. Build and run:
   ```bash
   npm install
   npm run build
   npm run migrate
   npm start
   ```

**Frontend** (e.g. Vercel, Netlify, or any static host):

1. Set `VITE_API_BASE_URL` to the deployed backend's `/api` URL.
2. Build and deploy the static output:
   ```bash
   npm install
   npm run build   # outputs to frontend/dist
   ```
3. Deploy the `dist/` folder as a static site.

> Live deployment URL: _add after deploying_.

## Trade-offs

- **No ORM** — used the `pg` driver directly with parameterized SQL for a
  schema this small; an ORM (e.g. Prisma) would add setup overhead without
  much payoff at this scale, at the cost of writing SQL by hand.
- **Search is substring matching** (`ILIKE`), not full-text search — simple
  and fast enough for a small leads table, but won't scale to fuzzy or
  ranked search on large datasets.
- **No authentication** — out of scope for this assignment; every request
  is treated as trusted. Not suitable for a real multi-user deployment as-is.
- **Optimistic UI updates** for status changes trade a small chance of a
  visible rollback-on-error for a snappier interaction.
- **Backend tests mock the database layer** rather than hitting a real
  Postgres instance, so they run fast and without infra, at the cost of not
  catching SQL-level bugs (those are covered instead by manually running
  migrations and exercising the API locally).

## Future Improvements

- Authentication and per-user/team lead ownership
- Pagination and sorting on the leads list
- Soft delete / archive instead of hard delete
- Activity log per lead (status change history, notes)
- Full-text search (e.g. Postgres `tsvector`) for larger datasets
- CI pipeline running tests and type-checks on every push
- E2E tests (Playwright/Cypress) covering the UI flows
