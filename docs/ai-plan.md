# WanderWise AI plan

## Architecture

The first AI feature is packing suggestions for a trip. The client calls
`POST /api/ai/trips/:tripId/packing-suggestions`. The route runs
`rejectUnauthenticated` → `checkTripAccess` → `aiRateLimit`, then calls
`aiService`. `aiService` builds a prompt from the trip (name, dates, locales,
map locations, trip category, itinerary) plus the requesting user's Item
Library and the trip's current packing list. It sends the prompt through
`aiClient` (Anthropic SDK) and runs the model output through a validator
before returning it.

The validator:

- keeps `fromLibrary` suggestions only if their IDs exist in the user's library
- checks each `newItems[].category` against the allowed category set
- drops any suggestion whose name is already on the trip's list (case-insensitive)

Usage is tracked in an `ai_usage` table. The limit is enforced with an atomic
`INSERT … ON CONFLICT … DO UPDATE … RETURNING count`. An in-memory limiter
won't work because the Fly machine scales to zero.

On the client, an `aiSuggestions` reducer holds
`{ status: 'idle'|'loading'|'ready'|'error', suggestions, error }` and resets
when `tripId` changes. A saga handles `FETCH_PACKING_SUGGESTIONS` with
`takeLatest`. Accept and "Accept all" dispatch the existing
`ADD_PACKING_LIST_ITEM` / `ADD_USER_ITEM` actions.

## Key decisions

- **AI never writes to the DB.** Accept uses the existing endpoints
  (`POST /api/packing-list`, `POST /api/user-items`). Accept still posts
  `item_name`, because list items aren't linked to library items by ID.
- **`server/ai` is JS with `// @ts-check` + JSDoc, not TypeScript.** The server
  is CommonJS with no build step, and local Node (22.12) doesn't match the
  floating `node:22-slim` image. Model output is checked by a runtime
  validator either way. Moving to TS is a separate PR, after Node ≥22.18 is
  pinned.
- **Packing categories are free-text strings.** There is no categories table
  and no `categoryId`. Categories are validated against
  `SELECT DISTINCT category FROM items WHERE user_id = $1` plus a small
  default set for new users.
- **Collaborators get suggestions from their own library.** `fromLibrary`
  comes from `req.user`'s library, not the trip owner's.
- **Use the new `checkTripAccess` middleware, never
  `checkTripOwnerOrCollaborator`.** The old one lets `req.body.tripId` override
  the URL. The new one reads only `req.params.tripId`, runs one EXISTS query
  (owner OR collaborator), and sets `req.trip`.
- **Prod Postgres is Neon.** Schema changes are SQL files in `migrations/`,
  applied with `psql` to both local and prod. There is no migration tool yet.
- **Model: `claude-haiku-5-5`.**

Implementation notes from the fit report:

- Express 4 doesn't catch errors from async handlers. Wrap the AI handler in
  try/catch.
- Never prefix the Anthropic key with `VITE_`. Set it with `fly secrets set`.
- Cap the library size sent in the prompt. Trip and item text is user-entered;
  treat it as untrusted.

## PR checklist

Done:

- [x] Security fixes (auth on API routes, trip access checks)
- [x] Deploy hygiene (`.env` in `.dockerignore`, deploy from `master`)
- [x] Land `ui-fixes-26` (it touches `PackingList.jsx` / `UserItems.jsx`)

To do:

- [ ] `checkTripAccess` middleware: params-only, one query, sets `req.trip`
- [ ] `ai_usage` migration: `migrations/001_ai_usage.sql`, documented in the README
- [ ] `server/ai/aiClient` + env: SDK dependency, `ANTHROPIC_API_KEY` in
      `.env` / `.env.example`, Fly secret
- [ ] `aiService` + validator + tests: unit tests on the validator against
      fixture library/list data
- [ ] Route: `POST /api/ai/trips/:tripId/packing-suggestions` with usage and
      token logging
- [ ] Saga + reducer: `aiSuggestions`, `takeLatest`, registered in
      `_root.saga.js` / `_root.reducer.js`
- [ ] Suggestions UI on the Packing List tab: per-item Accept and "Accept all"

## Later features

- **Server-side Mapbox:** all Mapbox use today is client-side
  (`VITE_MAPBOX_TOKEN`). Server-side geocoding needs a separate server token,
  ideally a restricted one.
- **"Notes" is undefined:** the only notes are `itinerary.notes`, and there is
  no notes feature. Define what "notes" means before building AI around it.
- **To-dos:** these live in the `checklist` table, served by
  `server/routes/todo.router.js` under `/api/checklist`.
