# Admin roles

Admin access is enforced in Convex. Frontend checks only gate UI.

## First super admin

1. Sign in once with `erwann.rousseau@icloud.com` so a Beach Profile exists.
2. Run `cd packages/backend && bun run seed:super-admin`.

Set `INITIAL_SUPER_ADMIN_EMAILS` as a comma-separated deployment variable to replace or add bootstrap emails. The seed upgrades one active matching profile to `super_admin`; it fails if the caller identity email is not allowlisted, the email has no profile, or more than one profile matches.
