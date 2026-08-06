import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "#/config/env";

export const authClient = createAuthClient({
  baseURL: env.convexSiteUrl,
  plugins: [convexClient(), crossDomainClient(), emailOTPClient()],
});
