# Admin App Agent Guide

## Scope

Applies to `apps/admin`.

## Stack

- React app with TanStack Router.
- Vite build.
- Tailwind CSS available.

## UI Rules

- Admin UI should be dense, operational, and scan-friendly.
- Avoid decorative landing-page composition.
- Use simple tables, forms, filters, and clear status labels.
- Reuse existing route/style patterns before adding new abstractions.

## Routing

- Route files live under `src/routes`.
- `routeTree.gen.ts` is generated. Do not edit it manually.
- Prefer `#/*` imports for app-local source imports when useful.

## Shared Contracts

- Import shared business constants/types/schemas through explicit feature subpaths.
- Do not import `@mybeachapp/shared` root or legacy buckets.

## Verification

Before finishing admin changes:

- `cd apps/admin && bun run check`
- `cd apps/admin && bun run typecheck`
- `cd apps/admin && bun run test`

For route/UI changes, run `cd apps/admin && bun run dev` and inspect the affected page.
