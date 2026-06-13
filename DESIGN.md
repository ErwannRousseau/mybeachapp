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
  background: "#F8FBFA"
  foreground: "#062A3B"
  transparent: "rgba(255, 255, 255, 0)"
  surface: "#FFFFFF"
  surface-foreground: "#062A3B"
  card: "#FFFFFF"
  card-foreground: "#062A3B"
  floating-surface: "rgba(255, 255, 255, 0.94)"
  floating-surface-foreground: "#062A3B"
  accent: "#0077B6"
  primary: "#FF6B4A"
  primary-foreground: "#062A3B"
  primary-pressed: "#9F331F"
  secondary: "#EAF8FC"
  secondary-foreground: "#062A3B"
  muted: "#EEF4F3"
  muted-foreground: "#5E717A"
  destructive: "#E85739"
  destructive-foreground: "#001923"
  destructive-soft: "#FCE4DC"
  success: "#1FAF84"
  success-soft: "#E5F5EE"
  warning: "#DDBB72"
  warning-foreground: "#062A3B"
  warning-soft: "#FFF9EA"
  border: "#DDE7E5"
  input: "#DDE7E5"
  ring: "#0077B6"
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
    textColor: "{colors.accent}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 16px
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
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
  filter-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.surface-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 14px
  filter-chip-active:
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
  status-badge-open:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 8px
  status-badge-warning:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 8px
  status-badge-destructive:
    backgroundColor: "{colors.destructive-soft}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 8px
  map-pin:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent}"
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
- app components: activity cards, map controls, search bars, create flow sections, navigation surfaces;
- screen composition: Expo Router screens compose `mobile/ui/` primitives and feature-local components.

Use Tamagui components and `styled()` as the default implementation path. Build app-specific wrappers in `mobile/ui/` instead of styling raw Tamagui components repeatedly inside screens.

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

## Tamagui implementation rules

- Keep Tamagui config explicit and small at first.
- Map the YAML frontmatter tokens to `tamagui.config.ts` before inventing new values.
- Prefer semantic names such as `$background`, `$surface`, `$card`, `$primary`, `$secondary`, `$accent`, `$muted`, `$border`, `$ring`, `$success`, `$warning`, and `$destructive`.
- Use Tamagui tokens for spacing, radius, size, and color. Avoid raw numbers or hex values in components when a token exists.
- Keep only simple `light` and `dark` themes initially. Avoid nested brand themes until there is a real use case.
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

Use these names if such cases appear later:

- `Surface`: normal token-driven Tamagui surface.
- `FloatingSurface`: map/search/nav overlay using normal Tamagui background, border, and shadow.
- `BackdropBlur`: real blur of content behind a view, isolated and rare.
- `NativeEffectSurface`: optional future experiment for native platform effects, never the default.

Do not name default components `GlassSurface`. The visual system may be called Beach Glass, but the component layer should stay implementation-neutral.

## Colors

The palette is coastal and high-contrast, designed for bright outdoor usage.

Use semantic background/foreground pairs for component tokens: `primary` pairs with `primary-foreground`, `secondary` with `secondary-foreground`, `surface` with `surface-foreground`, `card` with `card-foreground`, `floating-surface` with `floating-surface-foreground`, `muted` with `muted-foreground`, and so on. The base token controls the surface; the `-foreground` token controls text and icons placed on that surface.

- **Primary / Coral (`#FF6B4A`):** the single dominant CTA on a screen. Reserve it for "Créer une activité", "Publier", "Je participe", and "Confirmer".
- **Secondary / Lagoon (`#EAF8FC`):** soft selected or secondary surfaces such as secondary buttons, selected chips, avatars, and quiet highlighted panels.
- **Accent / Ocean (`#0077B6`):** navigation, links, focus states, map controls, and location-oriented text or icons.
- **Success / Mint (`#1FAF84`):** open states, successful joins, published confirmations, and positive status feedback.
- **Warning / Sand (`#DDBB72`):** almost-full activities, caution states, and secondary attention without urgency.
- **Background (`#F8FBFA`):** app-level background with a subtle green-blue tint. It should never read as plain grey.
- **Surface (`#FFFFFF`):** generic raised or floating UI such as sheets, forms, search bars, filters, nav containers, and controls.
- **Floating surface (`rgba(255,255,255,0.94)`):** map overlays and compact floating controls that need a slight airy feel without requiring real blur.
- **Card (`#FFFFFF`):** repeated content cards only, such as activity previews. It has its own token so component intent stays clear even when it currently shares the same hex as Surface.
- **Foreground (`#062A3B`):** default text. It is deep ocean navy for daylight readability.
- **Muted foreground (`#5E717A`):** metadata, helper text, timestamps, and less important labels.
- **Border (`#DDE7E5`):** inputs, separators, table rows, and quiet structural lines.

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

**Buttons:** Primary buttons use Primary Coral fill, deep navy text for AA contrast, pill radius, 54px height, and strong body typography. Pressed Primary Coral states use white text for AA contrast. Use one primary button per screen. Secondary buttons use Secondary Lagoon fill with `secondary-foreground` text. Ghost buttons are transparent low-emphasis actions and should not compete with the primary CTA.

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

**Filter chips:** Use short labels such as "Aujourd'hui", "Volley", "Paddle", "Yoga", "Pétanque", and "Proche". Active chips use Secondary Lagoon background with `secondary-foreground` text. Inactive chips stay quiet.

**Bottom sheets:** Use for activity previews, nearby lists, and place selection. Use a visible handle, 32px top radius, 20px padding, and no more than two visible CTAs. Prefer a Tamagui-compatible sheet implementation before adding a platform-specific sheet.

**Bottom navigation:** The mobile app may use a persistent bottom navigation with a central create action. Keep one shared cross-platform implementation unless native navigation behavior forces otherwise. Use a white surface, muted inactive icons, Accent Ocean for selected discovery/profile items, and Primary Coral only for the selected create action.

Recommended items are "Carte", "Liste", central "Créer", and "Profil". Active discovery/profile items use Accent Ocean icons. Inactive items use navy or muted text with lower visual emphasis while preserving AA contrast. The central create action uses Primary Coral and should remain visually dominant; use a plus icon with accessible label "Créer une activité". Keep icon targets at least 44px and labels short.

**Map pins:** Use round 44px pins with centered category icons. Open activities use Mint, almost-full activities use Sand, full activities use muted neutral, and cancelled or finished activities should usually be hidden from the live map.

**Inputs:** Use 52px height, visible label, short placeholder, white fill, clear border, and Accent Ocean focus state. Placeholder text must not be the only label.

**Status badges:** Use French labels: "Ouvert", "Complet", "Annulé", and "Terminé". Pair color with label.

**Empty states:** Use one simple line illustration or icon, one short title, one practical explanation, and one useful CTA.

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
