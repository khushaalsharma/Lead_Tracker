# AGENT.md — AI Usage Documentation

This document is required by the Stylework assignment and records how AI
assistance was used to build this project, what it generated, what was
written/reviewed manually, and the key engineering decisions made along the
way.

## AI Tool Used

- **Claude** (Anthropic) — used as a pair-programmer for the full stack:
  backend API, frontend UI, tests, and documentation.

## How AI Was Used

The assignment explicitly allows and encourages AI tools, so Claude was used
to generate the initial implementation for every layer of the app, which was
then reviewed, compiled, and tested (rather than accepted blindly).

### Prompts Used (summarized)

1. "Build a Lead Tracker: React + TypeScript frontend, Node.js/Express
   backend, PostgreSQL. Features: create lead, update lead status, search
   leads, list leads. Fields: Name, Email, Phone, Status, Created At."
2. "Scaffold the Express + TypeScript backend with a PostgreSQL connection
   pool, config via `.env`, and centralized error handling."
3. "Write the SQL migration and a small migration runner for the leads table,
   plus a data access layer (model) with create / list / search / update
   status functions."
4. "Implement REST endpoints for lead CRUD with input validation
   (email format, phone format, valid status enum)."
5. "Write Jest + Supertest tests for the routes (mocking the DB layer) and
   unit tests for the validation middleware."
6. "Scaffold a Vite + React + TypeScript frontend with a typed API client,
   a create-lead form, a searchable/sortable lead table with inline status
   updates, and basic styling."
7. "Write the README (architecture, setup, deployment, trade-offs, future
   improvements) and this AGENT.md."

### AI-Generated Sections

- All backend source files under `backend/src/` and `backend/scripts/`
  (server setup, DB config, model, controller, routes, validation
  middleware).
- Backend tests under `backend/tests/`.
- All frontend source files under `frontend/src/` (components, API client,
  types, styling).
- The SQL migration, `docker-compose.yml`, and this documentation.

### Manually Reviewed / Verified

Nothing here was accepted purely on trust — every generated piece was
checked and run before being committed:

- Ran `tsc --noEmit` on both `backend/` and `frontend/` to confirm the code
  actually compiles under `strict` TypeScript.
- Ran the backend test suite (`npm test`) — **14/14 tests passing** —
  covering validation logic and all four API endpoints (create, list,
  search, update status), including error paths (400s, 404s).
- Ran `vite build` on the frontend to confirm a clean production bundle.
- Manually reviewed the SQL migration for correctness (enum type, indexes on
  the columns actually used for search, `pgcrypto` extension for UUID
  generation).
- Manually reviewed the validation regexes (email, phone) and the search
  query (`ILIKE`-style matching across name/email/phone plus exact match on
  status) for sensible behavior rather than trusting the first draft.
- Adjusted commit boundaries and messages by hand so the git history reads
  as a logical build-up (structure → backend → tests → frontend → tests →
  docs) rather than one dump.

## Key Engineering Decisions

- **Search implemented as a query parameter on the list endpoint**
  (`GET /api/leads?q=...`) rather than a separate route, since "search" and
  "list" return the same shape of data and the frontend can reuse one
  fetch function.
- **Status is a Postgres `ENUM`** rather than a free-text column, to keep
  invalid statuses out of the database itself as a second line of defense
  behind the API-level validation.
- **DB access layer kept separate from route handlers** (`models/lead.ts`)
  so the routes could be tested with the model mocked out, instead of
  requiring a live database in CI.
- **Optimistic UI update for status changes** on the frontend (the table
  updates immediately, then rolls back if the API call fails) for a
  snappier feel, with the plain list/search endpoints kept intentionally
  simple.
- **No ORM** — used the `pg` driver directly with parameterized queries.
  For a schema this small, an ORM would add more overhead than it saves;
  a "Future Improvements" note in the README covers when that trade-off
  would flip.
