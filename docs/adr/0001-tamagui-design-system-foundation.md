---
status: accepted
---

# Tamagui Design System Foundation

## Context

My Beach App needs a practical mobile design-system foundation for Expo and React Native. The app targets iOS and Android, but the MVP should move quickly and avoid duplicated platform-specific component work.

The product UI is map-first, mobile-first, and centered on three actions: see nearby beach activities, create an activity with a pinned meeting point, and join an activity in one tap.

The project already has these architectural choices:

- Mobile runtime: Expo + React Native + Expo Router.
- Backend: Convex.
- Auth: Better Auth where auth is involved.
- Package manager / monorepo tooling: Bun workspaces + Turborepo.

## Decision

My Beach App will use **Tamagui** as the primary foundation for the mobile design system.

Tamagui will own:

- design tokens;
- light and dark themes;
- reusable UI primitives;
- component variants;
- shared cross-platform visual implementation;
- most screen-level UI composition through `mobile/ui/` and Expo Router screens.

The default strategy is **shared cross-platform UI first**. iOS and Android should use the same Tamagui component implementation whenever possible. Platform-specific implementations require a concrete product, accessibility, native capability, or maintenance reason.

## Non-goals

The design-system foundation is not based on:

- Expo UI as the default UI layer;
- SwiftUI-specific components;
- Jetpack Compose-specific components;
- Liquid Glass;
- `expo-glass-effect`;
- `expo-blur`;
- Takeout Pro architecture;
- One;
- Zero;
- Drizzle.

These tools or ideas may still be evaluated later for isolated use cases, but they are not part of the default foundation.

## Considered options

### Tamagui as the design-system foundation

Pros:

- Provides a React Native-compatible style system, tokens, themes, variants, and reusable components.
- Works with Expo and React Native.
- Supports a shared cross-platform implementation strategy.
- Lets the app build a project-specific design system instead of relying on a generic Material or iOS-only UI kit.
- Keeps the MVP focused by avoiding separate SwiftUI/Compose implementations.

Cons:

- Requires learning Tamagui configuration and conventions.
- Requires building and owning app-specific components.
- Can become complex if themes, variants, and abstractions are overused too early.

### React Native views with a custom style system

Pros:

- Maximum simplicity at the very beginning.
- No large UI framework assumptions.

Cons:

- More manual token plumbing.
- More risk of inconsistent styles across screens.
- Less structure for reusable variants and design-system components.

### Native platform UI foundation

Pros:

- Can produce highly native platform-specific UI.
- May be useful for specific controls or effects later.

Cons:

- Creates duplicated implementation work for iOS and Android.
- Slows down MVP development.
- Makes design-system consistency harder.
- Encourages platform-specific visual effects before product flows are stable.

## Consequences

- `mobile/ui/` is the home of design-system primitives and reusable components.
- App screens should use `mobile/ui/` components before styling raw Tamagui primitives directly.
- `tamagui.config.ts` should map values from `DESIGN.md` and remain easy to audit.
- The app should start with simple `light` and `dark` themes only.
- Components should use tokens and variants instead of hardcoded colors, spacing, radius, and typography.
- Primary Coral remains reserved for the dominant screen CTA.
- The visual system should stay close between iOS and Android by default.
- Real blur and native visual effects must be isolated behind explicit primitives if introduced later.
- No generic `GlassSurface` should be part of the baseline design system.
- No Takeout Pro structure or dependencies should be copied into the app unless explicitly approved for a narrow reason.

## Verification

For design-system changes:

1. Check that the component uses Tamagui tokens or project UI primitives instead of hardcoded values.
2. Check that the implementation is shared cross-platform unless a platform split is justified.
3. Check that body text stays at least 16 px and touch targets stay at least 44 px.
4. Check that customer-facing copy is French and uses `tu`.
5. Run the smallest relevant package checks before claiming completion.
