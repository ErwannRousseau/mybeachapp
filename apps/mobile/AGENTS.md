# Mobile App Agent Guide

## Scope

Applies to `apps/mobile`.

## Stack

- Expo Router app.
- Expo SDK 56: read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing Expo code.
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

- Use shared Zod schemas/validators from `@mybeachapp/shared/<feature>/...` when validating business input.
- Translate stable category/status/message keys in the mobile app; do not localize shared constants.

## Verification

Before finishing mobile changes:

- `cd apps/mobile && bun run check`
- `cd apps/mobile && bun run typecheck`
- `cd apps/mobile && bun run test`

Expo SDK 56 note: this repo uses Bun isolated installs. `expo-doctor` may report
duplicate native dependencies for identical Expo package versions installed in
Bun's `.bun` store under different peer contexts. Treat only that specific
duplicate-dependencies check as expected when `expo prebuild --clean` and
`expo-modules-autolinking verify --verbose` show a single linked native module
set and all package checks pass.

For visual UI changes, run the app and inspect the affected screen.
