---
version: alpha
name: My Beach App - Beach Glass
description: Map-first mobile design system for creating, discovering, and joining beach activities.
figma: https://www.figma.com/design/qdPkOVunrpcviPSMuPxWNl/My-Beach-App-%E2%80%94-Design-System---MVP-Mockups?node-id=78-2
architecture:
  foundation: Tamagui
  runtime: Expo React Native
  navigation: Expo Router
  backend: Convex
  auth: Better Auth
  platformStrategy: shared-cross-platform-first
  webPriority: not-primary
  nativeMaterials: case-by-case-only
colors:
  background: "hsla(235, 20%, 97%, 1)"
  foreground: "hsla(240, 55%, 12%, 1)"
  transparent: "rgba(255, 255, 255, 0)"
  surface: "#FFFFFF"
  surface-foreground: "hsla(240, 55%, 12%, 1)"
  card: "#FFFFFF"
  card-foreground: "hsla(240, 55%, 12%, 1)"
  floating-surface: "rgba(255, 255, 255, 0.94)"
  floating-surface-foreground: "hsla(240, 55%, 12%, 1)"
  accent: "hsla(42, 84%, 54%, 1)"
  primary: "#FF6B4A"
  primary-foreground: "hsla(240, 55%, 12%, 1)"
  primary-pressed: "#9F331F"
  secondary: "hsla(45, 50%, 88%, 1)"
  secondary-foreground: "hsla(38, 95%, 5%, 1)"
  muted: "hsla(236, 23%, 91%, 1)"
  muted-foreground: "hsla(240, 38%, 50%, 1)"
  destructive: "#E5484D"
  destructive-foreground: "#641723"
  destructive-soft: "#FEEBEC"
  success: "#30A46C"
  success-soft: "#E6F6EB"
  warning: "#FFE629"
  warning-foreground: "#473B1F"
  warning-soft: "#FFFAB8"
  border: "hsla(238, 25%, 85%, 1)"
  input: "hsla(238, 25%, 85%, 1)"
  ring: "hsla(42, 84%, 54%, 1)"
typography:
  headline-display:
    fontFamily: system
    fontSize: 34px
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: 0px
  headline-lg:
    fontFamily: system
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: 0px
  headline-md:
    fontFamily: system
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.27
    letterSpacing: 0px
  title-sm:
    fontFamily: system
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: 0px
  body-md:
    fontFamily: system
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-strong:
    fontFamily: system
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0px
  label-md:
    fontFamily: system
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.38
    letterSpacing: 0px
  label-sm:
    fontFamily: system
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.27
    letterSpacing: 0.02em
rounded:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  full: 9999px
spacing:
  none: 0px
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  xxxxl: 48px
  gutter-mobile: 16px
  gutter-mobile-wide: 20px
  touch-min: 44px
  touch-preferred: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    height: 54px
    padding: 20px
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.surface}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    height: 54px
    padding: 20px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    height: 54px
    padding: 20px
  button-ghost:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 16px
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    height: 54px
    padding: 20px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 16px
  activity-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.xl}"
    padding: 16px
  floating-surface:
    backgroundColor: "{colors.floating-surface}"
    textColor: "{colors.floating-surface-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 16px
  avatar:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    height: 44px
    width: 44px
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.surface-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 14px
  chip-active:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 14px
  tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.surface-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 10px
  search-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.surface-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    height: 52px
    padding: 16px
  bottom-sheet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.surface-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xxl}"
    padding: 20px
  sheet-handle:
    backgroundColor: "{colors.muted-foreground}"
    rounded: "{rounded.full}"
    height: 5px
    width: 48px
  bottom-nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.surface-foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.xl}"
    height: 80px
    padding: 12px
  bottom-nav-item-active:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 8px
  bottom-nav-item-inactive:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 8px
  nav-create-action:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.headline-md}"
    rounded: "{rounded.full}"
    height: 58px
    width: 58px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    height: 52px
    padding: 16px
  input-disabled:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    height: 52px
    padding: 16px
  input-border:
    backgroundColor: "{colors.input}"
    height: 1px
  field-focus-ring:
    backgroundColor: "{colors.ring}"
    rounded: "{rounded.lg}"
    height: 2px
  activity-status-tag-open:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 8px
  activity-status-tag-warning:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 8px
  activity-status-tag-destructive:
    backgroundColor: "{colors.destructive-soft}"
    textColor: "{colors.destructive-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 8px
  map-pin:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 44px
    width: 44px
  map-pin-open:
    backgroundColor: "{colors.success}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 44px
    width: 44px
  map-pin-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.warning-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 44px
    width: 44px
  map-pin-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 44px
    width: 44px
  separator:
    backgroundColor: "{colors.border}"
    height: 1px
  app-background:
    backgroundColor: "{colors.background}"
  metadata-text:
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label-md}"
  subtle-text:
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label-sm}"
---

# My Beach App Design System

## Overview

**Figma source of truth:** [My Beach App — Design System & MVP Mockups](https://www.figma.com/design/qdPkOVunrpcviPSMuPxWNl/My-Beach-App-%E2%80%94-Design-System---MVP-Mockups?node-id=78-2)

My Beach App is a map-first mobile application for creating, discovering, and joining beach activities around Pornichet, La Baule, and the Loire-Atlantique coast. The product promise is simple: "Il te manque des joueurs ? Trouve-les sur la plage."

The design direction is **Beach Glass**: bright, breathable, coastal, premium, lightweight, and immediately usable outdoors. In this document, "Beach Glass" is a brand mood, not a platform material requirement. The app should feel clear, fresh, slightly translucent where useful, and polished without spending time on platform-specific visual effects.

The MVP is intentionally narrow. Every screen should support at least one core action: see nearby activities, create an activity with a precise pinned meeting point, or join an activity in one tap. Do not introduce chat, groups, payments, reputation, marketplace behavior, social feeds, or moderation-heavy surfaces unless explicitly requested.

The product targets iOS and Android through **Expo, React Native, Expo Router, Tamagui, Convex, and Better Auth**. Tamagui is the design-system foundation for reusable UI, tokens, themes, layout primitives, and components. The default strategy is **shared cross-platform UI first**: one implementation should serve iOS and Android unless a concrete product, accessibility, or native capability requirement justifies a platform split.

Customer-facing copy is French by default. Use short, direct, warm sentences with `tu`. Documentation and code comments may be English. Avoid emoji and decorative symbols in product UI.

## Design-system architecture

Tamagui owns the UI foundation:

- tokens: colors, spacing, radius, typography, size, z-index, shadows;
- themes: at minimum `light` and `dark`, with brand values mapped to semantic names;
- primitives: `Box`, `Text`, `Stack`, `Button`, `Card`, `Input`, `Sheet`, `Badge`, `Avatar`, `Chip`, `Surface`;
- screen composition: Expo Router screens compose `mobile/ui/` primitives and feature-local components.

Use Tamagui components and `styled()` as the default implementation path. Build design-system primitives in `mobile/ui/` instead of styling raw Tamagui components repeatedly inside screens.

`mobile/ui/` is a product design-system primitive layer for My Beach App, not a generic component toolkit and not a feature interface directory. Components should be opinionated by default: they encode the app's visual language, allowed variants, spacing, shapes, and touch behavior. Avoid recreating Tamagui's full API surface inside app components.

Keep `mobile/ui/` imports explicit. Do not add a barrel file by default; import primitives from their file path, for example `mobile/ui/button`, `mobile/ui/card`, or `mobile/ui/typography`.

Name `mobile/ui` files after their public primitive. Do not keep legacy compatibility files when renaming primitives. During migration, replace `filter-chip.tsx` with `chip.tsx`, `empty-state.tsx` with `empty.tsx`, remove public `status-badge.tsx` in favor of feature-owned `ActivityStatusTag`, remove `label.tsx` in favor of `FieldLabel`, and move `pin.tsx` to the map or activities feature when it represents a GPS Pin or activity marker.

Keep feature interfaces outside `mobile/ui`. Components such as `ActivityCard`, `ActivityStatusTag`, `AuthCard`, `OnboardingCard`, and `ProfileCard` belong under their feature or route area because they encode product language, data shape, or flow context. They should compose `mobile/ui` primitives such as `Card`, `Button`, `Text`, `Tag`, and `Avatar`.

Keep component APIs narrow. Expose product variants such as `variant`, `size`, `selected`, `state`, and `disabled` only when they represent real app states. Tamagui layout props from the underlying styled component are acceptable as composition escape hatches, but avoid speculative visual variants and boolean-prop-heavy monoliths.

Allow Tamagui layout props on `mobile/ui` primitives when they help composition, such as `p`, `px`, `py`, `m`, `gap`, `w`, `h`, `f`, `ai`, and `jc`. Keep visual identity props controlled by the component API and variants: do not rely on ad hoc `bg`, `color`, `rounded`, `borderColor`, or typography overrides in screens when a variant or semantic primitive should exist.

Typography exports should stay explicit: `Text`, `Title`, and `Headline`. Do not expose a public `Typography` component. Use `Text` for body, labels, helper text, and metadata; `Title` for cards, sections, and sheets; `Headline` for screen-level and onboarding headings.

Follow Takeout Pro's useful composition convention for surfaces and cards: name product components by usage, and keep their styled `Frame` internal when possible. `Surface` and `FloatingSurface` are low-level primitives for shared layout needs; `Card` is for real content cards only. Prefer feature-owned components such as `ActivityCard`, `ProfileCard`, `AuthCard`, or `OnboardingCard` over a generic `Card` with many visual variants. Avoid using `Card` everywhere just because the current background is white.

Use `Card`, `Surface`, and `FloatingSurface` with strict intent:

- `Card`: autonomous content unit that can stand in a list or feed, usually with title, content, metadata, or actions. Examples include activity, auth, onboarding, and profile feature cards.
- `Surface`: neutral visual container for grouping UI or holding layout. It must not represent a domain object by itself. Examples include form sections, filter panels, and quiet screen sections.
- `FloatingSurface`: overlay surface above another context such as a map, scroll content, or screen edge. Examples include floating search, map controls, bottom navigation, and compact overlay actions.

Do not use `Card` as a generic white background or layout wrapper. If the component is only grouping controls or creating contrast, use `Surface` or `FloatingSurface`.

Use flat exports by default. Compound dot APIs are allowed only when the subcomponent has no meaningful use outside its parent and the grouped API is materially clearer, following Takeout Pro's pattern for components such as `Dialog.Header`, `ListItem.Icon`, or `Button.Text`. Decide case by case from actual usage instead of forcing every component into either style.

Forms should use a small flat `Field` system inspired by shadcn/radix composition: `Field`, `FieldLabel`, `FieldDescription`, and `FieldError`. Keep `Input` independent and controlled by the screen or feature layer. Do not add `FieldControl` or `FieldGroup` until repeated form composition proves they are needed. Do not couple `mobile/ui` form primitives directly to React Hook Form; form controllers belong in feature code. Do not expose a standalone public `Label` primitive by default, and do not keep `mobile/ui/label.tsx` during migration. Form labels should use `FieldLabel`; non-form label-like text should use `Text` until repeated non-form usage proves a dedicated primitive is needed. `Input` should expose `invalid` for error styling and rely on native/Tamagui states for focus and disabled behavior; do not use an `inputState` prop with manual `focused`, `disabled`, or `error` values.

Sheets should stay presentation primitives in `mobile/ui`: `Sheet`, `SheetHeader`, `SheetBody`, `SheetActions`, `SheetTitle`, and `SheetDescription`. They may own layout, radius, padding, handle, backdrop, animation, and safe-area behavior, but they must not know about activities, auth, onboarding, navigation, Convex queries, or which actions a feature should show. Feature sheets such as `ActivitySheet`, `PlacePickerSheet`, or `CityPickerSheet` belong under their owning feature and compose these primitives. Takeout Pro often uses Tamagui's low-level `Sheet.Frame` and `Sheet.Overlay` directly in features, while wrapping dialogs behind higher-level composition. For My Beach App, keep `SheetFrame`, `SheetOverlay`, and `SheetHandle` internal by default so feature code does not reassemble sheet mechanics repeatedly. Add a narrow escape hatch only when a real feature cannot be expressed through the public sheet primitives.

Empty states should use flat composable primitives in `mobile/ui`: `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, and `EmptyContent`. They must not include default product copy, queries, navigation, or feature actions. Feature-owned empty states may wrap these primitives only when the same copy/action pattern repeats. Migrate directly to this composable API; do not keep legacy `EmptyState` props such as `title` or `body`.

Avatar should stay in `mobile/ui` as a composable visual primitive with the API `Avatar`, `AvatarImage`, and `AvatarFallback`. Use `<Avatar><AvatarImage src="..." /><AvatarFallback>CN</AvatarFallback></Avatar>` instead of a monolithic `Avatar src fallback` prop API. Feature-owned components such as `BeachProfileAvatar`, `ParticipantAvatar`, or `OrganizerAvatar` may compose these primitives and own profile-specific fallback logic. Migrate directly to the composable API; do not keep legacy `src`, `fallback`, or `alt` props on `Avatar`.

Recommended layering:

```text
Tamagui config and tokens
        ↓
mobile/ui/ primitives
        ↓
feature-level components
        ↓
Expo Router screens
```

Do not start from a platform-native split. Do not create separate iOS and Android component implementations unless the requirement is unavoidable. Avoid native-only visual experiments in the design-system core.

The current mobile Tamagui configuration is documented in `apps/mobile/tamagui-prompt.md`, generated from `apps/mobile/tamagui.config.ts` with `bunx tamagui generate-prompt`. Use that generated prompt for exact token names, shorthand rules, theme names, media queries, and available Tamagui components when implementing UI.

## Tamagui implementation rules

- Keep Tamagui config explicit and auditable.
- Map the YAML frontmatter tokens to `tamagui.config.ts` before inventing new values.
- Prefer semantic names such as `$background`, `$surface`, `$card`, `$primary`, `$secondary`, `$accent`, `$muted`, `$border`, `$ring`, `$success`, `$warning`, and `$destructive`.
- Use Tamagui tokens for spacing, radius, size, and color. Avoid raw numbers or hex values in components when a token exists.
- Base themes are `light` and `dark`, generated with Tamagui v5. Child themes such as `accent`, `warning`, `error`, and `success` may be used when their semantic purpose is explicit.
- Use Tamagui shorthand props in UI code because the generated config sets `onlyAllowShorthands: true`.
- App screens should import from `mobile/ui/` first. Direct imports from `tamagui` are acceptable for layout composition, but reusable visual decisions belong in `mobile/ui/`.
- Prefer `export function` declarations for UI components.
- Do not use default exports for UI components.
- Do not add barrel files by default.
- Prefer flat Compound Component naming: `Sheet`, `SheetHeader`, `SheetBody`, `SheetActions`, not dot APIs and not boolean-prop-heavy monoliths.
- Use Tamagui variants for meaningful visual states: intent, size, selected, disabled, emphasis, density.
- Do not over-generalize components before they are used in at least two places.

## Native materials and blur policy

The baseline design system should not depend on Liquid Glass, Expo UI, SwiftUI, Jetpack Compose, or backdrop blur.

Use plain Tamagui surfaces by default: solid or slightly translucent backgrounds, borders, shadows, elevation-like styling, and clear tokens. This keeps iOS and Android visually close and avoids duplicated implementation work.

Native materials, Liquid Glass, `expo-glass-effect`, `expo-blur`, or Expo UI may be considered later only for isolated cases where the product benefit is clear, such as a modal backdrop, a map overlay requiring real background blur, or a very specific native control. Those cases must be implemented behind explicit primitives and must not leak into generic components.

`Button` is the deliberate exception to the "minimal primitive" rule: it may expose mobile-first effects directly because button feedback is core interaction behavior. Keep these effects optional and token-driven. Do not make every button glassy, animated, or visually loud by default.

Takeout Pro's `TabBar` pattern is a reference for app-level navigation, not a `mobile/ui` primitive. Keep effects such as blur, glass, and backdrop layers separated from route-aware navigation components. `BackdropBlur` is a reserved future primitive name, not something to create proactively. Add it only when a concrete component needs real backdrop blur; it may wrap `expo-blur` similarly to Takeout's `BlurView`, but it must remain isolated and optional.

Use these names if such cases appear later:

- `Surface`: normal token-driven Tamagui surface.
- `FloatingSurface`: map/search/nav overlay using normal Tamagui background, border, and shadow.
- `BackdropBlur`: real blur of content behind a view, isolated and rare. Do not create it before first real usage.
- `NativeEffectSurface`: optional future experiment for native platform effects, never the default.

Do not name default components `GlassSurface`. The visual system may be called Beach Glass, but the component layer should stay implementation-neutral.

## Colors

The palette is coastal and high-contrast, designed for bright outdoor usage.

Use semantic background/foreground pairs for component tokens: `primary` pairs with `primary-foreground`, `secondary` with `secondary-foreground`, `surface` with `surface-foreground`, `card` with `card-foreground`, `floating-surface` with `floating-surface-foreground`, `muted` with `muted-foreground`, and so on. The base token controls the surface; the `-foreground` token controls text and icons placed on that surface.

- **Primary / Coral (`#FF6B4A`):** the single dominant CTA on a screen. Reserve it for "Créer une activité", "Publier", "Je participe", and "Confirmer".
- **Secondary / Sunlit foam (`hsla(45, 50%, 88%, 1)`):** soft selected or secondary surfaces such as secondary buttons, selected chips, avatars, and quiet highlighted panels.
- **Accent / Golden sand (`hsla(42, 84%, 54%, 1)`):** focus rings, active accents, map controls, and warm location-oriented emphasis.
- **Success / Tamagui green (`#30A46C`):** open states, successful joins, published confirmations, and positive status feedback.
- **Warning / Bright sand (`#FFE629`):** almost-full activities, caution states, and secondary attention without urgency.
- **Background (`hsla(235, 20%, 97%, 1)`):** app-level background with a cool coastal tint. It should never read as flat grey.
- **Surface (`#FFFFFF`):** generic raised or floating UI such as sheets, forms, search bars, filters, nav containers, and controls.
- **Floating surface (`rgba(255,255,255,0.94)`):** map overlays and compact floating controls that need a slight airy feel without requiring real blur.
- **Card (`#FFFFFF`):** repeated content cards only, such as activity previews. It has its own token so component intent stays clear even when it currently shares the same hex as Surface.
- **Foreground (`hsla(240, 55%, 12%, 1)`):** default text. It is deep navy for daylight readability.
- **Muted foreground (`hsla(240, 38%, 50%, 1)`):** metadata, helper text, timestamps, and less important labels.
- **Border (`hsla(238, 25%, 85%, 1)`):** inputs, separators, table rows, and quiet structural lines.

State must never rely on color alone. Pair status color with a label or icon. Primary Coral is not decorative; if a screen has multiple Coral elements, the hierarchy is wrong. Avoid dark dashboards, neon colors, purple gradients, synthetic beach gradients, and generic template palettes.

## Typography

Typography uses native system fonts so the product feels platform-correct and stays easy to implement.

- **iOS:** system font, equivalent to SF Pro.
- **Android:** system font, equivalent to Roboto.
- **Web/admin and previews:** Inter or `system-ui` is acceptable.
- **MVP rule:** no custom font dependency is required for the mobile product.

Use sentence case for buttons, labels, titles, and navigation. Keep body text at 16px or larger. Labels can be compact, but they must remain readable outdoors. Letter spacing should stay at 0 for most text; small labels may use slight positive spacing only when needed.

Good French UI copy:

- "Trouver une activité"
- "Créer une activité"
- "Je participe"
- "Il reste 2 places"
- "Rendez-vous près du poste de secours"
- "Aucune activité autour de toi"

Avoid corporate or technical labels such as "Soumettre", "Effectuer une opération", "Entité", and "Flux de participation".

## Layout

The layout is mobile-first and map-first. The map is the primary discovery surface; details belong in cards, bottom sheets, and detail screens.

Use a 4px spacing rhythm with 16px to 20px horizontal screen gutters. Cards need at least 16px internal padding. Bottom sheets need at least 20px internal padding. The space between cards should usually be 12px to 16px. Touch targets must be at least 44px, with 48px preferred for primary interactions.

The map screen should keep controls floating and compact:

```text
[Floating search bar]
[Horizontal filter chips]

        Full-screen map
        Activity pins

[Preview sheet or nearby list]
[Create activity action]
```

The create flow should be stepped instead of one long form:

1. Activity: title, category, optional description.
2. When: date, time, duration.
3. Where: place search, map, adjustable pin.
4. Publish: capacity, optional photo, final summary.

Target publish time is under two minutes. If geolocation is refused, the user must still be able to search by city, beach, or address.

## Elevation & depth

Depth is soft, daylight-friendly, and tinted with the deep navy rather than pure black.

- **Small elevation:** `0 2px 8px rgba(6,42,59,0.08)` for resting cards and list rows.
- **Medium elevation:** `0 6px 16px rgba(6,42,59,0.12)` for floating chips, FAB containers, and active controls.
- **Large elevation:** `0 12px 28px rgba(6,42,59,0.16)` for sticky CTAs, raised sheets, and highest-priority overlays.

On native React Native, express these through the closest Tamagui/RN-compatible shadow and elevation props. Do not build separate iOS and Android shadow systems unless necessary. If map tiles or photos reduce readability under a floating surface, increase opacity, add a scrim, or use a plain white card.

## Shapes

The shape language is rounded, friendly, and touch-first.

- **24px radius:** activity cards, search bars, and large floating controls.
- **32px radius:** bottom sheets and raised panel tops.
- **9999px pill radius:** CTAs, chips, status badges, avatars, and round map pins.
- **16px to 20px radius:** inputs, image thumbnails, and smaller utility containers.

Avoid sharp-cornered mobile UI. Do not mix square and rounded systems within the same screen. Cards should feel soft but not cartoonish.

## Components

**Buttons:** Primary buttons use Primary Coral fill, deep navy text for AA contrast, pill radius, 54px height, and strong body typography. Pressed Primary Coral states use white text for AA contrast. Use one primary button per screen. Secondary buttons use Secondary Sunlit Foam fill with `secondary-foreground` text. Ghost buttons are transparent low-emphasis actions and should not compete with the primary CTA.

The `Button` component should be a complete mobile-first primitive inspired by Takeout Pro, while removing web-only behavior. Keep mobile capabilities such as `icon`, `iconAfter`, optional `Button.Text` and `Button.Icon` helpers when they make usage clearer, `glass`, `glassTint`, `glint`, `disableGlint`, `haptic`, `delayPress`, and fixed-width or full-width layout controls. Remove or ignore web-specific code such as hover-only styling, Safari corrections, browser tooltip wrappers, and CSS-only fallbacks. Glass, Glint, and haptics are interaction enhancements, not the default visual identity of every button.

Button haptics are opt-in by default. `haptic` defaults to `false`; `haptic={true}` maps to a light impact; string values such as `"light"`, `"medium"`, or `"heavy"` may be used for explicit intent. Use haptics for meaningful actions such as creating, publishing, confirming, or joining a Beach Activity. Do not trigger haptics by default for secondary actions, ghost buttons, repeated list actions, or navigation.

Do not add a separate `IconButton` primitive for the MVP. Use `Button size="icon"` for icon-only actions, and keep `Button.Icon` available for icon composition. Only introduce `IconButton` later if a real platform behavior diverges from normal button behavior.

Use `@tamagui/lucide-icons` for standard line icons by default. Do not create a generic icon wrapper or icon barrel for the MVP. If custom shared product icons become necessary, put them under `mobile/ui/icons/` and import them explicitly. Feature-only custom icons should stay with their owning feature.

Do not keep map pins in `mobile/ui` when they encode Beach Activity meaning. A `GPS Pin`, `ActivityMapPin`, or `MeetingPointPin` belongs to the map or activities feature because it owns domain concepts such as Activity Status, Activity Category, Meeting Point, selection state, and map behavior. Only introduce a generic `mobile/ui` pin primitive later if a non-domain repeated visual need appears.

Keep `SearchBar` in `mobile/ui` only as a generic visual input primitive: search icon, text input, placeholder, clear/submit behavior, focus state, and token-driven shape. Product behavior such as place search, Activity Category search, opening a picker sheet, map overlay positioning, route header placement, or geolocation fallback belongs in feature or screen components such as `PlaceSearchBar`, `ActivitySearchBar`, or `MapSearchOverlay`.

Expose selected pill controls as `Chip` in `mobile/ui`, not `FilterChip`. `Chip` is the generic selectable primitive with token-driven selected/unselected states. Filtering behavior, Activity Category mapping, query updates, and copy such as "Sports de ballon" belong in feature or screen components such as `ActivityCategoryChip` or `ActivityFilters`.

Keep `Tag` as the generic non-interactive pill primitive in `mobile/ui`. Do not keep `StatusBadge` in `mobile/ui` when it knows Activity Status values or French status labels. Activity status rendering belongs in a feature component such as `ActivityStatusTag`, which maps `open`, `full`, `cancelled`, or `finished` to a `Tag` variant and copy.

**Activity cards:** Use white surface, 24px radius, 16px padding, soft elevation, a clear title, metadata, capacity, and status. Keep the hierarchy shallow.

```text
[Photo or icon]
Beach-volley
Aujourd'hui · 14:00 · 450 m
4/6 participants
[Ouvert]
```

**Floating surfaces:** Use `FloatingSurface` for search, chips containers, compact map controls, preview cards, and nav containers. It should be implemented with Tamagui background, border, radius, and shadow. It should not blur content behind it.

**Search bar:** Use a floating 52px high search bar with 24px radius. Suggested placeholders: "Ville, plage ou adresse", "Rechercher une plage", and "Pornichet, La Baule...".

**Chips:** Use short labels such as "Aujourd'hui", "Volley", "Paddle", "Yoga", "Pétanque", and "Proche". Active chips use Secondary Sunlit Foam background with `secondary-foreground` text. Inactive chips stay quiet.

**Tags and activity status:** `Tag` is the generic pill primitive for short metadata. Activity status display is feature-owned because it maps the **Activity Status** domain concept to user-facing French labels. Implement it as an `ActivityStatusTag` under the activities feature, composed from `Tag`, with labels such as "Ouvert", "Complet", "Annulé", and "Terminé".

**Bottom sheets:** Use for activity previews, nearby lists, and place selection. Use a visible handle, 32px top radius, 20px padding, and no more than two visible CTAs. Prefer a Tamagui-compatible sheet implementation before adding a platform-specific sheet. Keep the primitive sheet generic; feature-specific sheets should decide title, content, queries, mutations, and actions.

**Bottom navigation:** The mobile app may use a persistent bottom navigation with a central create action. Keep it as an app navigation component, not a `mobile/ui` primitive, because it knows routes, selected state, safe-area behavior, and navigation actions. It should compose primitives such as `FloatingSurface`, `BackdropBlur` if explicitly needed, `Text`, and icon/button primitives. Use a white or floating surface, muted inactive icons, Accent Golden Sand for selected discovery/profile items, and Primary Coral only for the selected create action.

Recommended items are "Carte", "Liste", central "Créer", and "Profil". Active discovery/profile items use Accent Golden Sand icons. Inactive items use navy or muted text with lower visual emphasis while preserving AA contrast. The central create action uses Primary Coral and should remain visually dominant; use a plus icon with accessible label "Créer une activité". Keep icon targets at least 44px and labels short.

Takeout Pro inspiration to keep: floating pill container, animated selected indicator, haptic feedback for meaningful tab/menu interactions, optional backdrop blur for expanded overlays, and safe-area-aware positioning. Do not copy Takeout's One routing, post creation dialog behavior, expanded post menu, or route names.

**Map pins:** Use round 44px pins with centered category icons. Open activities use Success Green, almost-full activities use Warning Bright Sand, selected pins may use Accent Golden Sand with foreground text/icons, full activities use muted neutral, and cancelled or finished activities should usually be hidden from the live map.

**Inputs:** Use 52px height, visible label, short placeholder, white fill, clear border, and Accent Golden Sand focus state. Placeholder text must not be the only label.

**Status badges:** Use French labels: "Ouvert", "Complet", "Annulé", and "Terminé". Pair color with label.

**Empty states:** Use one simple line illustration or icon, one short title, one practical explanation, and one useful CTA. Compose them with `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, and `EmptyContent` instead of a monolithic `EmptyState` prop API. Start with `EmptyMedia variant="icon"`; add variants such as `image`, `illustration`, or `avatar` only when real usage requires them.

```text
Aucune activité autour de toi
Déplace la carte ou crée la première activité sur cette plage.
[Créer une activité]
```

**Iconography:** Use simple rounded line icons with 2px stroke. Lucide-style icons are the preferred visual language. Do not use emoji as product icons.

**Photography and illustrations:** Place photos should help users recognize the meeting point. Keep them bright, natural, and cleanly cropped. Avoid dramatic filters, black-and-white treatment, heavy grain, and childish cartoons.

## Do's and Don'ts

- Do read the YAML frontmatter first when generating UI.
- Do use semantic tokens from this file before inventing new values.
- Do keep the app mobile-first, map-first, and focused on see, create, and join.
- Do keep customer-facing MVP copy in French.
- Do use Tamagui as the design-system foundation for reusable mobile UI.
- Do keep iOS and Android visually close by default.
- Do build shared cross-platform components first.
- Do use reusable `mobile/ui/` components instead of one-off screen styling.
- Do use Tamagui tokens, themes, variants, and styled primitives where useful.
- Do reserve Primary Coral for the main CTA only.
- Do keep text readable on map, photo, or floating surfaces.
- Do use line icons and text labels for status clarity.
- Do isolate real blur or native visual effects behind explicit primitives if they are ever introduced.
- Don't use Expo UI, SwiftUI, Jetpack Compose, Liquid Glass, or native materials as the default design-system foundation.
- Don't use `expo-blur` as the default foundation for cards, buttons, chips, panels, navigation, or generic surfaces.
- Don't introduce separate platform implementations without a clear reason.
- Don't add Takeout Pro architecture, One, Zero, Drizzle, or unrelated starter assumptions.
- Don't use Primary Coral as decoration, metadata, secondary links, or non-critical highlights.
- Don't overload map pins, cards, or bottom sheets with verbose text.
- Don't add chat, groups, payments, reputation, marketplaces, or social feeds unless explicitly requested.
- Don't hardcode colors, spacing, radius, or type values when shared tokens exist.
- Don't communicate state by color alone.
- Don't use emoji or decorative symbols in product UI.
