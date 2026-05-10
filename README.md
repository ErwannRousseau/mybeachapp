# My Beach App

My Beach App is a mobile app for finding, creating, and joining beach activities in a few minutes.

The idea is simple: when players or participants are missing, the app helps people see what is happening nearby, create an activity with a precise meeting point, and let others join quickly.

## MVP

The MVP focuses on three actions:

1. See nearby activities on a map or list.
2. Create an activity with a place, time, and number of spots.
3. Join an activity in one tap.

## Activities

The first planned categories are beach volleyball, paddle, surf, yoga, running, pétanque, swimming, and other.

## MVP Limits

My Beach App is not a social network, marketplace, or messaging app. The MVP does not include chat, payments, groups, reputation, or a social feed.

## Technical Stack

The MVP monorepo follows the validated architecture note:

- Mobile: Expo + React Native + TypeScript.
- Backend: Convex functions, database, realtime, and file storage.
- Admin: Vite + React + TanStack Router.
- Tooling: Bun Workspaces + Turborepo.
- Shared code: TypeScript package for types, constants, validators, and utilities.

## Repository Structure

```txt
apps/
  mobile/        Expo React Native app
  admin/         Vite React admin app
packages/
  backend/       Convex backend package
  shared/        Shared constants, types, validators, utilities
  config/        Shared TypeScript and Biome conventions
```

## Development

Install dependencies:

```sh
bun install
```

Run workspace tasks through Turbo:

```sh
bun run dev
bun run build
bun run check # check:fix to fix lint and formatting issues
bun run typecheck
bun run test
```

Package scripts own the actual work; root scripts only delegate to `turbo run`.
