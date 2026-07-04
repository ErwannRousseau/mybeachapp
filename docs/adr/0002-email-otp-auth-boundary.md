---
status: accepted
---

# Email OTP Auth Boundary

My Beach App uses email OTP as the primary MVP email auth path: requesting a code and verifying it either creates a **Signed-in User** for a new email or opens the existing session for a known email. **Onboarding** remains a separate product flow that completes the **Beach Profile**; a verified auth session alone does not mean the user can create or join **Beach Activities** until the required profile fields, especially pseudo, are complete.

Development may expose the last sent email OTP through logs and a dev-only Convex retrieval path to avoid depending on an external mail provider during local work. Preview and production must send OTP emails through the configured provider and must not expose OTP retrieval paths.
