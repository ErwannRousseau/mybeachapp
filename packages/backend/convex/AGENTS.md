# Convex Agent Guide

## Scope

Applies to `packages/backend/convex`.

## Convex Module Shape

- Keep public Convex modules at the Convex root when they are intended as callable modules, e.g. `activities.ts`, `users.ts`, `participations.ts`.
- Keep generated files in `_generated` untouched unless running Convex codegen.
- Put reusable Convex-only helpers in `lib/*`.
- Do not move Convex callable exports into nested feature folders unless the public API path is intentionally changing.

## Shared Contracts

- Import shared constants/types from explicit feature subpaths:
  - `@mybeachapp/shared/activities/constants`
  - `@mybeachapp/shared/participations/constants`
  - `@mybeachapp/shared/users/constants`
- Do not import `@mybeachapp/shared` root or legacy shared buckets.
- Convex runtime validation still uses `convex/values` validators. Zod schemas from shared are not a replacement for Convex `args` or `defineTable` validators.
- Do not validate Convex environment variables with Zod inside request paths. Keep `config/env.ts` typed, simple, and non-throwing; optional deployment variables should disable optional capabilities rather than crash auth routes.

## Schema Rules

- Keep `schema.ts` aligned with shared constants for enum-like values.
- Use `literalUnion(...)` for shared string literal arrays.
- Add indexes only for real query patterns.
- Keep storage ids typed as `v.id("_storage")`.

## Function Rules

- Validate public args with Convex validators.
- Keep mutations small and explicit about server-owned fields such as timestamps, status, and counts.
- Prefer returning ids/documents directly over shaping UI-specific response objects in Convex unless needed.

## Verification

Before finishing Convex changes:

- `cd packages/backend && bun run typecheck`
- `cd packages/backend && bun run test`
- `cd packages/backend && bun run check`

Convex typecheck runs `convex codegen --dry-run --typecheck enable`.
