# Mobile permissions

Mobile permission checks control interface states. Convex remains the
enforcement source of truth for every protected query and mutation.

The shared resource-action policy lives in
`packages/shared/src/permissions/index.ts`. Mobile screens consume it through
`usePermissions()` from `apps/mobile/src/permissions/permissions.ts`.

## Screen usage

Wait for the session and Beach Profile query before rendering a protected
action, then call the typed checker:

```tsx
const permissions = usePermissions();

if (permissions.isPending) {
  return <LoadingState />;
}

const canCreate = permissions.can("activity.create");
```

Contextual permissions require their matching context:

```tsx
const canUpdate = permissions.can("activity.updateOwn", {
  creatorId: activity.creatorId,
  currentParticipantsCount: activity.currentParticipantsCount,
  maxParticipants: activity.maxParticipants,
  startDateTime: activity.startDateTime,
});
```

TypeScript rejects missing or incompatible contexts. While the profile query
is pending, or when the profile is disabled, every permission fails closed.

## Integration rules

1. Use `isPending` for the loading state.
2. Use `can(...)` to render or disable the protected action.
3. Call the Convex function normally and handle its authorization error.
4. Keep role comparisons out of screens; add policy in the shared package.

The creation screen currently checks `activity.create`. Wire the remaining
permissions when their mobile screens are introduced:

- `activity.join`
- `activity.updateOwn` with Activity context
- `activity.cancelOwn` with Activity context
- `activity.leaveOwn` with Participation context

See [`docs/adr/0004-admin-role-bootstrap.md`](../adr/0004-admin-role-bootstrap.md)
for the resource-action decision and complete MVP permission list.
