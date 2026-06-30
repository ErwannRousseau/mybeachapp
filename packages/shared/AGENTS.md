# Shared Package Agent Guide

## Scope

Applies to `packages/shared`.

## Purpose

`@mybeachapp/shared` owns reusable business contracts: feature constants, types, Zod schemas, validators, and small pure utilities.

## Structure

Use feature folders:

- `src/auth/*`
- `src/activities/*`
- `src/participations/*`
- `src/users/*`
- `src/internal/*` for non-public shared helpers
- `src/utils/*` for generic pure utilities

Within each feature, keep files explicit:

- `constants.ts`
- `types.ts`
- `schemas.ts`
- `validators.ts`
- `*.test.ts`

## Public Interface

- Do not add barrel files.
- Expose public modules through explicit `package.json` subpath exports.
- Keep `types` before `default` in export condition objects. Esbuild warns when `default` comes first.
- Do not reintroduce root exports such as `@mybeachapp/shared`, `@mybeachapp/shared/constants`, `@mybeachapp/shared/types`, or `@mybeachapp/shared/validators`.

## Zod

- Use standard `zod`, not `zod/mini`, unless bundle pressure is proven.
- Put shared validation schemas in `schemas.ts`.
- Put predicate-style helpers and compatibility validation functions in `validators.ts`.
- Use stable message keys such as `title_required` and `category_invalid`; these can be translated by apps.
- Convert Zod issues through `src/internal/validation.ts` when returning `ValidationError[]`.

## Tests

- Test through the feature interface, not internal helpers.
- Keep test files next to the feature they exercise.
- Validation tests should assert both fields and stable message keys when behavior matters to UI.

## Verification

Before finishing shared changes:

- `cd packages/shared && bun run check`
- `cd packages/shared && bun run typecheck`
- `cd packages/shared && bun run test`

For exported contract changes, also run root `bun run typecheck` and `bun run test`.
