---
version: alpha
name: My Beach App - Beach Glass
description: Map-first mobile design system for creating, discovering, and joining beach activities.
figma: https://www.figma.com/design/qdPkOVunrpcviPSMuPxWNl/My-Beach-App-%E2%80%94-Design-System---MVP-Mockups?node-id=78-2
colors:
  primary: "#FF6B4A"
  primary-hover: "#C9442A"
  primary-pressed: "#9F331F"
  secondary: "#0077B6"
  secondary-soft: "#EAF8FC"
  secondary-hover: "#00A6D6"
  success: "#1FAF84"
  success-strong: "#148F6B"
  success-soft: "#E5F5EE"
  warning: "#DDBB72"
  warning-soft: "#FFF9EA"
  error: "#E85739"
  error-soft: "#FCE4DC"
  background: "#F8FBFA"
  surface: "#FFFFFF"
  surface-soft: "#EEF4F3"
  on-surface: "#062A3B"
  on-surface-muted: "#6B7C86"
  on-surface-subtle: "#9BAAAD"
  border: "#DDE7E5"
  border-strong: "#9BAAAD"
  glass-tint: "#FFFFFF"
typography:
  headline-display:
    fontFamily: SF Pro Display, SF Pro Text, Roboto, Inter, system-ui, sans-serif
    fontSize: 34px
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: 0px
  headline-lg:
    fontFamily: SF Pro Display, SF Pro Text, Roboto, Inter, system-ui, sans-serif
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: 0px
  headline-md:
    fontFamily: SF Pro Display, SF Pro Text, Roboto, Inter, system-ui, sans-serif
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.27
    letterSpacing: 0px
  title-sm:
    fontFamily: SF Pro Text, Roboto, Inter, system-ui, sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: 0px
  body-md:
    fontFamily: SF Pro Text, Roboto, Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-strong:
    fontFamily: SF Pro Text, Roboto, Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0px
  label-md:
    fontFamily: SF Pro Text, Roboto, Inter, system-ui, sans-serif
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.38
    letterSpacing: 0px
  label-sm:
    fontFamily: SF Pro Text, Roboto, Inter, system-ui, sans-serif
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
    textColor: "{colors.on-surface}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    height: 54px
    padding: 20px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.surface}"
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
    backgroundColor: "{colors.secondary-soft}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    height: 54px
    padding: 20px
  button-secondary-hover:
    backgroundColor: "{colors.secondary-hover}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    height: 54px
    padding: 20px
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 16px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 16px
  activity-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.xl}"
    padding: 16px
  filter-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 14px
  filter-chip-active:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 14px
  search-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    height: 52px
    padding: 16px
  bottom-sheet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xxl}"
    padding: 20px
  bottom-nav-ios:
    backgroundColor: "{colors.glass-tint}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    height: 74px
    padding: 16px
  bottom-nav-android:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.xl}"
    height: 80px
    padding: 12px
  bottom-nav-item-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 8px
  bottom-nav-item-inactive:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 8px
  nav-create-action:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-md}"
    rounded: "{rounded.full}"
    height: 58px
    width: 58px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    height: 52px
    padding: 16px
  status-badge-open:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 8px
  status-badge-warning:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 8px
  status-badge-error:
    backgroundColor: "{colors.error-soft}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 8px
  map-pin:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 44px
    width: 44px
  app-background:
    backgroundColor: "{colors.background}"
  surface-soft-panel:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 16px
  metadata-text:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label-md}"
  subtle-text:
    textColor: "{colors.on-surface-subtle}"
    typography: "{typography.label-sm}"
  secondary-swatch:
    backgroundColor: "{colors.secondary}"
  success-swatch:
    backgroundColor: "{colors.success}"
  success-strong-swatch:
    backgroundColor: "{colors.success-strong}"
  warning-swatch:
    backgroundColor: "{colors.warning}"
  error-swatch:
    backgroundColor: "{colors.error}"
  border-swatch:
    backgroundColor: "{colors.border}"
  border-strong-swatch:
    backgroundColor: "{colors.border-strong}"
  glass-surface:
    backgroundColor: "{colors.glass-tint}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 16px
---

# My Beach App Design System

## Overview

**Figma source of truth:** [My Beach App — Design System & MVP Mockups](https://www.figma.com/design/qdPkOVunrpcviPSMuPxWNl/My-Beach-App-%E2%80%94-Design-System---MVP-Mockups?node-id=78-2)

My Beach App is a map-first mobile application for creating, discovering, and joining beach activities around Pornichet, La Baule, and the Loire-Atlantique coast. The product promise is simple: "Il te manque des joueurs ? Trouve-les sur la plage."

The design direction is **Beach Glass**: bright, breathable, coastal, premium, lightweight, and immediately usable outdoors. The interface should feel social without becoming a feed, polished without becoming precious, and fast enough that creating an activity feels spontaneous.

The MVP is intentionally narrow. Every screen should support at least one core action: see nearby activities, create an activity with a precise pinned meeting point, or join an activity in one tap. Do not introduce chat, groups, payments, reputation, marketplace behavior, social feeds, or moderation-heavy surfaces unless explicitly requested.

The product targets iOS and Android through Expo and React Native. iOS may use native Liquid Glass for floating controls. Android should use Compose-native white surfaces with soft elevation, implemented through `@expo/ui/jetpack-compose` where native UI layers are needed. Web or admin surfaces should stay operational, clean, and connected to the same palette without glass effects.

Customer-facing copy is French by default. Use short, direct, warm sentences with `tu`. Documentation and code comments may be English. Avoid emoji and decorative symbols in product UI.

## Colors

The palette is coastal and high-contrast, designed for bright outdoor usage.

- **Primary / Coral ( #FF6B4A):** the single dominant CTA on a screen. Reserve it for "Créer une activité", "Publier", "Je participe", and "Confirmer".
- **Secondary / Ocean ( #0077B6):** navigation, links, selected filters, focus states, map controls, and location-oriented UI.
- **Success / Mint ( #1FAF84):** open states, successful joins, published confirmations, and positive status feedback.
- **Warning / Sand ( #DDBB72):** almost-full activities, caution states, and secondary attention without urgency.
- **Background ( #F8FBFA):** app-level background with a subtle green-blue tint. It should never read as plain grey.
- **Surface ( #FFFFFF):** cards, sheets, forms, floating controls, and operational panels.
- **On-surface ( #062A3B):** primary text. It is deep ocean navy for daylight readability.
- **Secondary text ( #6B7C86):** metadata, helper text, timestamps, and less important labels.
- **Border ( #DDE7E5):** inputs, separators, table rows, and quiet structural lines.

State must never rely on color alone. Pair status color with a label or icon. Primary Coral is not decorative; if a screen has multiple Coral elements, the hierarchy is wrong. Avoid dark dashboards, neon colors, purple gradients, synthetic beach gradients, and generic template palettes.

## Typography

Typography uses native system fonts so the product feels platform-correct and stays easy to implement.

- **iOS:** SF Pro through native system typography.
- **Android:** Roboto through native system typography.
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

## Elevation & Depth

Depth is soft, daylight-friendly, and tinted with the deep navy rather than pure black.

- **Small elevation:** `0 2px 8px rgba(6,42,59,0.08)` for resting cards and list rows.
- **Medium elevation:** `0 6px 16px rgba(6,42,59,0.12)` for floating chips, FAB containers, and active controls.
- **Large elevation:** `0 12px 28px rgba(6,42,59,0.16)` for sticky CTAs, raised sheets, and highest-priority overlays.

Liquid Glass is an iOS material, not a decoration. Use it only through a wrapper such as `GlassSurface`, and only for floating search, filter chips, activity preview sheets, floating tab bars, FAB containers, compact headers, and map controls. Android should use semi-opaque white surfaces and elevation in a Compose-native style instead. Web/admin should use plain white surfaces, borders, and shadows.

If map tiles or photos reduce readability under a translucent surface, add a scrim, increase opacity, or fall back to a white card.

## Shapes

The shape language is rounded, friendly, and touch-first.

- **24px radius:** activity cards, search bars, and large floating controls.
- **32px radius:** bottom sheets and raised panel tops.
- **9999px pill radius:** CTAs, chips, status badges, avatars, and round map pins.
- **16px to 20px radius:** inputs, image thumbnails, and smaller utility containers.

Avoid sharp-cornered mobile UI. Do not mix square and rounded systems within the same screen. Cards should feel soft but not cartoonish.

## Components

**Buttons:** Primary buttons use Primary Coral fill, deep navy text for AA contrast, pill radius, 54px height, and strong body typography. Darker hover and pressed Primary Coral states may use white text when contrast remains AA-compliant. Use one primary button per screen. Secondary buttons use deep navy text on a soft Secondary Ocean background. Ghost buttons are for low-emphasis actions and should not compete with the primary CTA.

**Activity cards:** Use white surface, 24px radius, 16px padding, soft elevation, a clear title, metadata, capacity, and status. Keep the hierarchy shallow.

```text
[Photo or icon]
Beach-volley
Aujourd'hui · 14:00 · 450 m
4/6 participants
[Ouvert]
```

**Search bar:** Use a floating 52px high search bar with 24px radius. On iOS map screens it may sit inside `GlassSurface`; on Android it should be an elevated white surface. Suggested placeholders: "Ville, plage ou adresse", "Rechercher une plage", and "Pornichet, La Baule...".

**Filter chips:** Use short labels such as "Aujourd'hui", "Volley", "Paddle", "Yoga", "Pétanque", and "Proche". Active chips use Secondary Ocean background with white text. Inactive chips stay quiet.

**Bottom sheets:** Use for activity previews, nearby lists, and place selection. Use a visible handle, 32px top radius, 20px padding, and no more than two visible CTAs.

**Bottom navigation:** The mobile app may use a persistent bottom navigation with a central create action. On iOS, treat it as an approved Liquid Glass floating surface: pill-shaped, detached from the screen edges, inside `GlassSurface`, respecting the safe-area inset, with soft navy-tinted elevation and enough opacity for map readability. On Android, translate the same hierarchy into Compose-native surfaces: opaque white bottom bar or navigation container, no blur, no fake glass, soft elevation, and a clear central FAB for create.

Recommended items are "Carte", "Liste", central "Créer", and "Profil". Active items use Secondary Ocean icon and label. Inactive items use navy text with lower visual emphasis through icon weight or opacity while preserving AA contrast. The central create action uses Primary Coral and should remain visually dominant, but it must still meet contrast rules; use a plus icon with accessible label "Créer une activité". Keep icon targets at least 44px and keep labels short.

**Map pins:** Use round 44px pins with centered category icons. Open activities use Mint, almost-full activities use Sand, full activities use muted neutral, and cancelled or finished activities should usually be hidden from the live map.

**Inputs:** Use 52px height, visible label, short placeholder, white fill, clear border, and Secondary Ocean focus state. Placeholder text must not be the only label.

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
- Do implement Android native surfaces in a Compose-native style through `@expo/ui/jetpack-compose` when native UI layers are required.
- Do reserve Primary Coral for the main CTA only.
- Do keep text readable on map, photo, or glass surfaces.
- Do make iOS and Android feel native in their own ways.
- Do use reusable components instead of one-off screen styling.
- Do use line icons and text labels for status clarity.
- Don't use Liquid Glass outside approved iOS floating surfaces.
- Don't imitate iOS glass on Android.
- Don't use Primary Coral as decoration, metadata, secondary links, or non-critical highlights.
- Don't overload map pins, cards, or bottom sheets with verbose text.
- Don't add chat, groups, payments, reputation, marketplaces, or social feeds unless explicitly requested.
- Don't hardcode colors, spacing, radius, or type values when shared tokens exist.
- Don't communicate state by color alone.
- Don't use emoji or decorative symbols in product UI.
