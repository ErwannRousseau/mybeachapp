# Mobile App Agent Guide

## Scope

Applies to `apps/mobile`.

## Stack

- Expo Router app.
- Expo SDK 56: read the exact versioned docs at <https://docs.expo.dev/versions/v56.0.0/> before writing Expo code.
- React Native with Tamagui.
- Use Expo-compatible APIs and libraries.

## UI Rules

- Follow the My Beach App design skill and Beach Glass direction when building app UI.
- Keep screens map-first and task-focused.
- Reuse existing components before adding new primitives.
- Avoid marketing-page patterns in app screens.
- Tamagui is the primary foundation for reusable design-system components.
- `tamagui.config.ts` must map values from `DESIGN.md` and stay easy to audit.
- Use Tamagui tokens, themes, styled primitives, and variants before raw React Native styles.
- Prefer shared cross-platform UI. Do not split iOS and Android implementations unless a concrete platform behavior requires it.
- Do not use Expo UI, SwiftUI, Jetpack Compose, Liquid Glass, `expo-glass-effect`, or `expo-blur` as the default design-system foundation.
- Real blur or native visual effects, if ever needed, must be isolated behind explicit primitives and kept out of generic components.
- Do not create or extend a default `GlassSurface` component. Use `Surface` and `FloatingSurface` for normal Tamagui surfaces.
- Implement reusable UI primitives with flat Compound Component naming (for example `Sheet`, `SheetHeader`, `SheetBody`, `SheetActions`) instead of dot names and boolean prop explosion.
- UI components must use `export function` declarations only.
- Do not use `const` component declarations, default exports, or barrel files for UI components.
- Do not import React-only types such as `ReactNode`, `PropsWithChildren`, `Ref`, `ReactElement`, `FC`, or `ComponentProps`. Use the `React` namespace directly in annotations, for example `React.ReactNode` or `React.Ref<T>`.
- Design system source components must live in `mobile/ui/`.
- Do not hard-code shared business constants; import from explicit `@mybeachapp/shared/*` feature subpaths.

## Tooling Rules

- Do not add workaround scripts for simulator or device selection unless the user explicitly asks for a custom script. Prefer package scripts that wrap official Expo CLI commands directly, and explain local simulator/device issues instead of hiding them behind helper scripts.

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
