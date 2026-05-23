# My Beach App Agent Guide

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues via `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage labels use the default five-label vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

Domain docs use multi-context layout via root `CONTEXT-MAP.md`. See `docs/agents/domain.md`

## Scope

This file applies to the whole repository. Deeper `AGENTS.md` files override it for their subtree.

## Workspace Shape

- Apps live in `apps/*`.
- Reusable packages live in `packages/*`.
- Use Bun for package scripts and dependency management.
- Root scripts delegate through Turborepo. Prefer `bun run check`, `bun run typecheck`, and `bun run test` before claiming completion.

## Architecture Rules

- Keep modules feature-oriented where that improves locality.
- Do not add barrel files by default. Prefer explicit package exports and explicit imports.
- For reusable UI components, prefer flat Compound Component APIs (for example `Sheet`, `SheetHeader`, `SheetBody`, `SheetActions`) over boolean-prop-heavy single components.
- UI components must be declared with `export function`.
- Do not use `const` component declarations or default exports for UI components.
- Design system source components must live in `mobile/ui/`.
- Keep shared business contracts in `packages/shared`; apps and backend should consume those contracts instead of duplicating constants or TypeScript types.
- Add dependencies at the narrowest package that uses them. Shared cross-package dependencies should use the root workspace catalog.
- Do not add new dependencies without a clear reason.

## Import Rules

- Prefer package subpath imports over root package imports.
- For `@mybeachapp/shared`, import explicit files such as:
  - `@mybeachapp/shared/activities/constants`
  - `@mybeachapp/shared/activities/types`
  - `@mybeachapp/shared/activities/schemas`
  - `@mybeachapp/shared/activities/validators`
- Avoid `@mybeachapp/shared` root imports.
- Avoid legacy technical buckets like `/constants`, `/types`, and `/validators`.

## Validation

- Use Zod for runtime validation by default, including app-local configuration such as public environment variables.
- Use Zod schemas in `packages/shared` for shared input/domain validation.
- Put reusable or cross-workspace validation helpers in `packages/shared`; keep purely app-local validation in the owning app.
- Keep Convex runtime validators (`v.*`) in Convex functions and schema definitions.
- Preserve stable error message keys where UI code may translate them.

## Verification

Run the smallest useful verification first, then broaden when touching shared contracts:

- Package local: `cd <package> && bun run check && bun run typecheck && bun run test`
- Cross-package/shared changes: `bun run check && bun run typecheck && bun run test`
- Backend changes: include Convex typecheck through `packages/backend` script.

## Git Safety

- Do not revert user changes.
- Treat generated files carefully. Regenerate only with the package's documented command.
- Keep diffs small and focused.
