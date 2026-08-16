import { query } from "./_generated/server";
import { getSocialProviders } from "./betterAuth/auth";
import { authComponent } from "./betterAuth/component";

export const getCapabilities = query({
  args: {},
  handler: async () => {
    const socialProviders = getSocialProviders();

    return {
      emailPassword: true,
      socialProviders: {
        apple: Boolean(socialProviders?.apple),
        google: Boolean(socialProviders?.google),
      },
    };
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.safeGetAuthUser(ctx);
  },
});

export const { getAuthUser } = authComponent.clientApi();
