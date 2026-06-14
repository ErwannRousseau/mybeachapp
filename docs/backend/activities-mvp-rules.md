# Beach Activities MVP Backend Rules

Convex is the source of truth for Beach Activities, Participations, Spots, and Activity Status.

## Participation

- Creating a Beach Activity automatically creates one Participation for the Organizer.
- A Signed-in User cannot join the same Beach Activity twice.
- A Signed-in User cannot join a full, cancelled, or finished Beach Activity.
- A Beach Activity whose `startDateTime` is in the past is treated as finished for join rules, even if its stored Activity Status is still `open` or `full`.
- Leaving a Beach Activity deletes the Participation for the MVP.
- `cancelledAt` and `status: "cancelled"` are reserved for a later history or anti-abuse need.

## Capacity

- `currentParticipantsCount` is updated server-side only.
- Joining increments `currentParticipantsCount`.
- Leaving decrements `currentParticipantsCount`.
- When `currentParticipantsCount` reaches `maxParticipants`, Activity Status becomes `full`.
- When a full Beach Activity loses a Participant, Activity Status becomes `open`.

## Organizer Permissions

- Only the Organizer can update or cancel their Beach Activity.
- Cancelling a Beach Activity changes Activity Status to `cancelled`.
- Finished Beach Activities cannot be joined.
- MVP does not require a cron to mark past Beach Activities as `finished`.
- A later Convex cron may persist `finished` status when needed for cleanup, analytics, or simpler queries.

## Client Trust

- Mobile clients are never trusted for authorization, capacity, Activity Status, or Participation rules.
- All rules above must be enforced in Convex mutations.
