# CLAUDE.md


# WanderWise

## Stack
- Frontend: React 19 + Vite, Redux (legacy createStore) + Redux-Saga, Mapbox GL
- Backend: Express 4 (CommonJS, plain node, no build step), Passport local,
  express-session + connect-pg-simple
- DB: Postgres on Neon. Hosting: Fly.io (scales to zero)
- Default branch is `master`, not `main`

## Commands
- Dev: 'npm run dev'
- Deploy: `npm run deploy`
- Migrations: SQL files in migrations/, applied manually with psql
  to local AND prod. database.sql is a reference snapshot and cannot
  run from scratch.

## Security rules (non-negotiable)
- Every route uses rejectUnauthenticated (returns 401; 403 is for
  logged in but not allowed, e.g. requireAdmin)
- Anything user-owned is scoped by req.user.id in the query
- Trip-scoped routes use checkTripAccess (server/modules/trip-access.js):
  reads req.params.tripId only, one owner-or-collaborator query, sets
  req.trip, 404 if no access. New routes use it.
- requireTripAccess (same file) is the existing check. It takes an id
  getter and doesn't set req.trip. Existing callers are being migrated
  to checkTripAccess; don't add new ones.
- Secrets never get a VITE_ prefix (those ship in the JS bundle)
- .env is never committed or shipped in the image

## Gotchas
- Vite build output is build/, not dist/
- VITE_ vars are build-time only; Fly secrets can't reach them
- Express 4 doesn't catch async errors: wrap handlers in try/catch
- Packing list items match library items by item_name, not ID
- Item categories are free-text strings, no categories table

## Conventions
- Saga action types are plain strings: FETCH_X / SET_X / ADD_X
- Use takeLatest for anything that costs money or quota
- New sagas/reducers register in _root.saga.js / _root.reducer.js

## How to work in this repo
- Small, focused PRs. One concern per PR.
- Don't modify files unrelated to the task
- If unsure about something in the codebase, say so instead of guessing
- No em dashes in docs or comments

## AI features
See docs/ai-plan.md for architecture, decisions, and PR checklist.

The plan and PR checklist are in [docs/ai-plan.md](docs/ai-plan.md). Key decisions:

- AI never writes to the DB; Accept uses the existing packing-list / user-items endpoints.
- `server/ai` is JS with `// @ts-check` + JSDoc, not TypeScript.
- Packing categories are free-text strings, validated against the user's distinct `items.category` values plus a small default set.
- Collaborators get suggestions from their own (`req.user`) library.
- Use the new `checkTripAccess` middleware (params-only, sets `req.trip`), not `requireTripAccess`.
- Prod Postgres is Neon; schema changes are SQL files in `migrations/`, applied with `psql` to local and prod.
- .env now points at a Neon dev branch, not prod.
- Model: `claude-haiku-5-5`.
