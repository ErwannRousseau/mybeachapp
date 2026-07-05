# Admin role bootstrap

Admin access uses the existing **Signed-in User** identity model: `admin` can operate the back-office, while `super_admin` can grant or revoke `admin` for other existing active **Signed-in Users**. Future admins create their account through the normal mobile sign-in flow and must have an existing active **Beach Profile** before a `super_admin` promotes them by exact email. The first `super_admin` is assigned through a manual seed or environment allowlist outside public app flows, because automatic "first user wins" bootstrap creates an avoidable privilege escalation race.

Revoking `admin` sets the profile role back to `user`. There is no `former_admin` role in the MVP.

The initial bootstrap email is `erwann.rousseau@icloud.com`, configured as deployment data rather than product UI state. Bootstrap happens through an explicit seed command, not automatically on login, so a later manual demotion is not silently undone. Additional bootstrap emails can be added by changing deployment configuration or by an existing `super_admin` granting `admin` in the back-office.

The seed is a one-way upgrade for an existing active **Beach Profile**: it may promote a matching profile to `super_admin`, but never demotes, disables, or creates users. If the bootstrap email matches zero or multiple profiles, the seed fails closed and requires manual cleanup.

Permissions are defined once in `@mybeachapp/shared/permissions` with Permix, then consumed by mobile, admin, and backend code. The permission model is resource-action based, so global roles like `admin` and contextual activity positions like **Organizer** or **Participant** do not get mixed together. Convex remains the enforcement source of truth; frontend permission checks only hide or reveal UI and route states.

The MVP permission set starts with `adminBackoffice.access`, `adminActivity.read`, `adminRole.grant`, `adminRole.revoke`, `activity.create`, `activity.join`, `activity.updateOwn`, `activity.cancelOwn`, and `activity.leaveOwn`. `activity.updateOwn` covers editable activity details before start, not status, participant records, or server-owned counters.
