# My Beach App Agent Guide

## Agent skills

### Design system

Use the My Beach App design skill for mobile UI, map-first UX, Tamagui components, design tokens, Figma translation, and design QA. The skill should read `DESIGN.md` first and treat it as the local source of truth.

When Tamagui-specific skills or documentation are available in the agent environment, read them before implementing Tamagui configuration, themes, variants, or reusable components.

### Issue tracker

Issues and PRDs are tracked in GitHub Issues via `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage labels use the default five-label vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

Domain docs use multi-context layout via root `CONTEXT-MAP.md` when present. See `docs/agents/domain.md`.

## Scope

This file applies to the whole repository. Deeper `AGENTS.md` files override it for their subtree.

## Product Context

- My Beach App is a map-first mobile app for creating, discovering, and joining beach activities on the Loire-Atlantique coast, especially Pornichet and La Baule.
- Customer-facing copy must be in French with `tu` form.
- MVP is intentionally narrow: nearby activities, create with pinned meeting point, join in one tap.
- Out of scope unless explicitly requested: chat, groups, payments, reputation, social feed, marketplace features.
- Design direction is defined in `DESIGN.md` as Beach Glass.
- Beach Glass is a visual mood, not a requirement to use native glass, blur, or Liquid Glass effects.
- Figma is the visual source of truth when a Figma frame is provided.

## Stack Baseline

- Monorepo: Bun workspaces + Turborepo (`bun`).
- Mobile: Expo SDK + React Native + Expo Router + Tamagui.
- Backend: Convex.
- Auth: Better Auth where auth is involved.
- Admin: Vite + React + TanStack Router.
- Shared packages: `@mybeachapp/shared`, `@mybeachapp/config`.
- Tooling baseline: Biome, Vitest, TypeScript.

## Workspace Shape

- Apps live in `apps/*`.
- Reusable packages live in `packages/*`.
- Use Bun for package scripts and dependency management.
- Root scripts delegate through Turborepo.
- Prefer `bun run check`, `bun run typecheck`, and `bun run test` before claiming completion.
- Root mobile wrappers are `bun run dev:android`, `bun run dev:ios18`, `bun run open:android`, `bun run open:ios18`, and `bun run native:prebuild`; they delegate to `apps/mobile/package.json`.
- For app-local Expo work, `apps/mobile` also exposes `bun run dev`, `bun run ios`, `bun run ios:18`, `bun run native:prebuild:android`, `bun run native:prebuild:ios`, `bun run start`, and `bun run web`.

## Mobile UI Architecture

- Tamagui is the primary design-system foundation.
- Expo Router screens should compose feature components and `mobile/ui/` primitives.
- Design-system source components must live in `mobile/ui/`.
- `tamagui.config.ts` should map values from `DESIGN.md` tokens.
- Keep the Tamagui configuration explicit and easy to audit.
- Start with simple `light` and `dark` themes; do not introduce nested theme complexity without a real use case.
- Use Tamagui tokens, themes, styled primitives, and variants for reusable UI.
- Prefer shared cross-platform UI first. Do not split iOS and Android implementations unless there is a concrete need.
- Do not use Expo UI, SwiftUI, Jetpack Compose, Liquid Glass, `expo-glass-effect`, or `expo-blur` as the default design-system foundation.
- Real blur or native visual effects, if ever needed, must be isolated behind explicit primitives and kept out of generic components.
- Do not introduce Takeout Pro architecture, One, Zero, Drizzle, or starter-kit assumptions into the app.

## Architecture Rules

- Keep modules feature-oriented where that improves locality.
- Do not add barrel files by default. Prefer explicit package exports and explicit imports.
- For reusable UI components, prefer flat Compound Component APIs such as `Sheet`, `SheetHeader`, `SheetBody`, `SheetActions` over boolean-prop-heavy single components.
- UI components must be declared with `export function`.
- Do not use `const` component declarations for UI components.
- Do not use default exports for UI components.
- Keep shared business contracts in `packages/shared`; apps and backend should consume those contracts instead of duplicating constants or TypeScript types.
- Add dependencies at the narrowest package that uses them. Shared cross-package dependencies should use the root workspace catalog.
- Do not add new dependencies without a clear reason.
- Keep decomposition incremental: at most one structural split per file in a single change.
- Do not create artificial `*-internal`, `*-helpers`, or technical bucket files just to satisfy file-size or line-count pressure.
- Split files only when the new boundary has a clear product, domain, design-system, or reusable API meaning.
- Avoid packing too much raw logic in one file or component; extract focused helpers/hooks.
- Test files must live in a `__tests__` directory next to the module they test across all apps and packages. For example, `ui/button.tsx` is tested by `ui/__tests__/button.test.tsx`, and `src/activities/validators.ts` is tested by `src/activities/__tests__/validators.test.ts`.

## Import Rules

- Prefer package subpath imports over root package imports.
- For `@mybeachapp/shared`, import explicit files such as:
  - `@mybeachapp/shared/activities/constants`
  - `@mybeachapp/shared/activities/schemas`
  - `@mybeachapp/shared/activities/types`
  - `@mybeachapp/shared/activities/validators`
  - `@mybeachapp/shared/auth/schemas`
  - `@mybeachapp/shared/auth/types`
  - `@mybeachapp/shared/users/validators`
  - same pattern for `participations`
- Avoid `@mybeachapp/shared` root imports.
- Avoid legacy technical buckets like `/constants`, `/types`, and `/validators`.
- In mobile UI code, prefer imports from `mobile/ui/` for design-system components.
- Direct imports from `tamagui` are acceptable for low-level layout composition, but reusable visual decisions belong in `mobile/ui/`.

## Design Rules

- Read `DESIGN.md` before creating or changing customer-facing UI.
- Read the YAML frontmatter before prose; it is the canonical token source.
- Use semantic tokens before inventing new values.
- Primary Coral is for the dominant CTA only.
- Use one dominant Coral action per screen.
- Minimum body text size is 16 px.
- Minimum touch target is 44 px.
- Cards and search bars use 24 px radius.
- Bottom sheets use 32 px radius.
- Inputs use visible labels and clear borders.
- State must not rely on color alone.
- No emoji in product UI.
- No decorative Unicode symbols.
- Customer-facing copy should be short, direct, warm French.

## Figma Workflow

When translating a Figma frame:

1. Require the exact frame URL if missing.
2. Use the Figma MCP connection to extract tokens, metadata, layout, and component structure.
3. Map extracted values to `DESIGN.md` tokens and Tamagui config.
4. Reuse `mobile/ui/` primitives before creating new components.
5. Implement with Tamagui tokens and variants.
6. Keep output shared cross-platform unless a platform split is justified.
7. Validate accessibility, touch targets, outdoor readability, and MVP scope.

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
- Mobile UI changes: include the mobile package checks and any available visual/story/screenshot checks.
- Mobile device checks usually mean `bun run dev:ios18`, `bun run dev:android`, or the matching `open:*` command, then inspect the affected screen.
- Design-system changes: verify token usage, component reuse, touch targets, and cross-platform behavior.

## Convex Guardrails

- Before editing Convex code, read `packages/backend/convex/_generated/ai/guidelines.md` first.
- Follow `packages/backend/AGENTS.md` for backend-specific overrides.

## CI Baseline

- CI runs `bun install --frozen-lockfile`, then `bun run check`, `bun run typecheck`, and `bun run test`.

## Git Safety

- Do not revert user changes.
- Treat generated files carefully. Regenerate only with the package's documented command.
- Keep diffs small and focused.

# Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them; don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No flexibility or configurability that was not requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't improve adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it; don't delete it.

When your changes create orphans:

- Remove imports, variables, and functions that your changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria require clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
