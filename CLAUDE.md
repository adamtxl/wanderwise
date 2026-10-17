# CLAUDE.md

## AI features

The plan and PR checklist are in [docs/ai-plan.md](docs/ai-plan.md). Key decisions:

- AI never writes to the DB; Accept uses the existing packing-list / user-items endpoints.
- `server/ai` is JS with `// @ts-check` + JSDoc, not TypeScript.
- Packing categories are free-text strings, validated against the user's distinct `items.category` values plus a small default set.
- Collaborators get suggestions from their own (`req.user`) library.
- Use the new `checkTripAccess` middleware, never `checkTripOwnerOrCollaborator`.
- Prod Postgres is Neon; schema changes are SQL files in `migrations/`, applied with `psql` to local and prod.
- Model: `claude-haiku-5-5`.
