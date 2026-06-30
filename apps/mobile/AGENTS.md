# Mobile App Agent Guide

## Scope

Applies to `apps/mobile`.

## Stack

- Expo Router app.
- Expo SDK 56: read the exact versioned docs at <https://docs.expo.dev/versions/v56.0.0/> before writing Expo code.
- React Native with Tamagui.
- Use Expo-compatible APIs and libraries.

## Local Commands

- `bun run dev` starts iOS on `iPhone 17 Pro`.
- `bun run ios:18` and `bun run dev:ios18` target `iPhone 16`.
- `bun run dev:android` and `bun run open:android` target `Medium_Phone_API_35`.
- `bun run open:ios18` starts `iPhone 16` without the bundler.
- `bun run native:prebuild`, `bun run native:prebuild:ios`, and `bun run native:prebuild:android` wrap Expo prebuild.
- `bun run start` and `bun run web` are available for bundler and web workflows.

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
- Do not create `BackdropBlur` or any blur primitive proactively. Add it only when a concrete component needs real backdrop blur.
- Do not create or extend a default `GlassSurface` component. Use `Surface` and `FloatingSurface` for normal Tamagui surfaces.
- Use `Card` only for autonomous content units. Use `Surface` for neutral UI grouping and `FloatingSurface` for overlays such as search, map controls, or bottom navigation. Do not use `Card` as a generic white background wrapper.
- Keep bottom navigation out of `mobile/ui/`; it is app navigation because it owns routes, selected state, safe area, and navigation actions. It may compose `FloatingSurface`, optional isolated blur/backdrop primitives, `Text`, and button/icon primitives.
- If using Takeout Pro as inspiration for bottom navigation, copy the idea of a floating pill, animated indicator, haptics, and optional backdrop blur only. Do not copy One routing, route names, expanded post menus, or Takeout app behavior.
- Do not create a separate `IconButton` primitive for the MVP. Use `Button size="icon"` and `Button.Icon` for icon-only button composition.
- Use `@tamagui/lucide-icons-2` for standard icons. Do not add a generic icon wrapper or barrel by default. Put shared custom product icons in `mobile/ui/icons/` only when real usage exists; feature-only icons belong with the owning feature.
- Implement reusable UI primitives with flat Compound Component naming (for example `Sheet`, `SheetHeader`, `SheetBody`, `SheetActions`) instead of dot names and boolean prop explosion.
- Reusable UI primitives may expose Tamagui layout props such as `p`, `px`, `gap`, `w`, `f`, `ai`, and `jc`. Keep visual identity props such as `bg`, `color`, `rounded`, `borderColor`, and typography choices controlled by component variants or semantic primitives.
- UI components must use `export function` declarations only.
- Do not use `const` component declarations, default exports, or barrel files for UI components.
- Do not import React-only types such as `ReactNode`, `PropsWithChildren`, `Ref`, `ReactElement`, `FC`, or `ComponentProps`. Use the `React` namespace directly in annotations, for example `React.ReactNode` or `React.Ref<T>`.
- Name mobile UI/component files in kebab-case. Component symbols stay PascalCase, but filenames must not use CamelCase.
- Design-system primitives must live in `mobile/ui/`.
- Name `mobile/ui` files after their public primitive. Do not keep legacy compatibility files when renaming primitives: migrate `filter-chip.tsx` to `chip.tsx`, `empty-state.tsx` to `empty.tsx`, remove public `status-badge.tsx` in favor of feature `ActivityStatusTag`, remove `label.tsx` in favor of `FieldLabel`, and move `pin.tsx` to the map or activities feature when it represents a GPS Pin or activity marker.
- Keep feature interfaces out of `mobile/ui/`. Components such as `ActivityCard`, `ActivityStatusTag`, `AuthCard`, `OnboardingCard`, and `ProfileCard` belong under their feature or route area and should compose `mobile/ui` primitives.
- Keep domain-specific status mapping out of `mobile/ui/`. Use `Tag` as the primitive, and implement activity status labels/states in an activities feature component.
- Do not keep `StatusBadge` in `mobile/ui/` when it knows Activity Status values or French labels. Implement status-specific UI as a feature component such as `ActivityStatusTag` that composes `Tag`.
- Keep Beach Activity map pins out of `mobile/ui/` when they encode domain state. Components such as `ActivityMapPin`, `MeetingPointPin`, or `GPSPin` belong under the map or activities feature because they own Activity Status, Meeting Point, selection, and map behavior.
- Keep `SearchBar` generic in `mobile/ui/`: it may own visual input presentation, search icon, placeholder, clear/submit behavior, and token-driven focus styling. Product-specific search behavior, picker sheets, map overlay placement, geolocation fallback, and route header composition belong in feature or screen components.
- Expose selectable pills as `Chip` in `mobile/ui/`, not `FilterChip`. Filtering behavior, Activity Category mapping, query updates, and product copy belong in feature or screen components such as `ActivityCategoryChip` or `ActivityFilters`.
- Keep `Sheet` generic in `mobile/ui/`: it owns presentation, handle, backdrop, layout, and safe-area behavior only. Feature sheets such as activity, place picker, or onboarding city picker sheets belong under their owning feature.
- Public sheet primitives are `Sheet`, `SheetHeader`, `SheetBody`, `SheetActions`, `SheetTitle`, and `SheetDescription`. Keep low-level `SheetFrame`, `SheetOverlay`, and `SheetHandle` internal by default; expose a narrow escape hatch only when a concrete feature needs it.
- Use composable `Empty` primitives in `mobile/ui/`: `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, and `EmptyContent`. Do not use a monolithic empty-state prop API for reusable UI, and do not keep legacy `EmptyState` `title` or `body` props during migration.
- Use composable `Avatar` primitives in `mobile/ui/`: `Avatar`, `AvatarImage`, and `AvatarFallback`. Feature components own profile-specific fallback and image selection logic. Do not keep legacy `Avatar` `src`, `fallback`, or `alt` props during migration.
- Use `FieldLabel` for form labels. Do not expose a standalone public `Label` primitive or keep `mobile/ui/label.tsx` during migration unless repeated non-form usage proves it is needed; use `Text` for label-like non-form copy.
- Keep the MVP `Field` system to `Field`, `FieldLabel`, `FieldDescription`, and `FieldError`. Do not add `FieldControl`, `FieldGroup`, or React Hook Form coupling inside `mobile/ui/`.
- `Input` should expose `invalid` for error styling and rely on native/Tamagui focus and disabled states. Do not keep an `inputState` prop with manual `focused`, `disabled`, or `error` values.
- Do not hard-code shared business constants; import from explicit `@mybeachapp/shared/*` feature subpaths.

## Tooling Rules

- Do not add workaround scripts for simulator or device selection unless the user explicitly asks for a custom script. Prefer package scripts that wrap official Expo CLI commands directly, and explain local simulator/device issues instead of hiding them behind helper scripts.

## Navigation

- Route files live under `app/`.
- Keep route-specific UI close to the route.
- Shared app components live under `components/`.
- Feature-specific interfaces should live under the owning feature when a `src/features/<feature>/components` area exists.

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
