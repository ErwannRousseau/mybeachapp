# Mobile App Agent Guide

## Scope

Applies to `apps/mobile`.

## Stack

- Expo Router app.
- Expo SDK 56: read the exact versioned docs at <https://docs.expo.dev/versions/v56.0.0/> before writing Expo code.
- React Native with Unistyles.
- Use Expo-compatible APIs and libraries.

## UI Rules

- Follow the My Beach App design skill and Beach Glass direction when building app UI.
- Keep screens map-first and task-focused.
- Reuse existing components before adding new primitives.
- Avoid marketing-page patterns in app screens.
- For iOS Liquid Glass-approved surfaces, prefer `@expo/ui/swift-ui` via app wrappers (for example `GlassSurface`) rather than ad-hoc effects.
- For Android surface implementations, prefer `@expo/ui/jetpack-compose` and keep a Compose-native style (no fake glass).
- Implement reusable UI primitives with flat Compound Component naming (for example `Sheet`, `SheetHeader`, `SheetBody`, `SheetActions`) instead of dot names and boolean prop explosion.
- UI components must use `export function` declarations only.
- Do not use `const` component declarations, default exports, or barrel files for UI components.
- Design system source components must live in `mobile/ui/`.
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
