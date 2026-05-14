# Mobile App Agent Guide

## Scope

Applies to `apps/mobile`.

## Stack

- Expo Router app.
- React Native with Unistyles.
- Use Expo-compatible APIs and libraries.

## UI Rules

- Follow the My Beach App design skill and Beach Glass direction when building app UI.
- Keep screens map-first and task-focused.
- Reuse existing components before adding new primitives.
- Avoid marketing-page patterns in app screens.
- Do not hard-code shared business constants; import from explicit `@mybeachapp/shared/*` feature subpaths.

## Navigation

- Route files live under `app/`.
- Keep route-specific UI close to the route.
- Shared app components live under `components/`.

## Validation and Contracts

- Use Zod for runtime validation by default, including app-local config such as public environment variables.
- Use shared Zod schemas/validators from `@mybeachapp/shared/<feature>/...` when validating business input.
- Put reusable or cross-package validation helpers in `packages/shared`; keep purely app-local validation in `apps/mobile`.
- Translate stable category/status/message keys in the mobile app; do not localize shared constants.

## Verification

Before finishing mobile changes:

- `cd apps/mobile && bun run check`
- `cd apps/mobile && bun run typecheck`
- `cd apps/mobile && bun run test`

For visual UI changes, run the app and inspect the affected screen.
