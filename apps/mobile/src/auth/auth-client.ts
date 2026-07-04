import { expoClient } from "@better-auth/expo/client";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

import { env } from "@/src/config/env";

export const authClient = createAuthClient({
  baseURL: env.convexSiteUrl,
  plugins: [
    convexClient(),
    emailOTPClient(),
    expoClient({
      scheme: "mybeachapp",
      storage: SecureStore,
      storagePrefix: "mybeachapp",
    }),
  ],
});
