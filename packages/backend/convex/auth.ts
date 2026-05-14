import Apple from "@auth/core/providers/apple";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import {
  authEmailSchema,
  authPasswordSchema,
} from "@mybeachapp/shared/auth/schemas";
import { ConvexError } from "convex/values";

const passwordProvider = Password({
  profile(params) {
    const email = authEmailSchema.safeParse(params.email);

    if (!email.success) {
      throw new ConvexError("email_invalid");
    }

    return { email: email.data };
  },
  validatePasswordRequirements(password: string) {
    const result = authPasswordSchema.safeParse(password);

    if (!result.success) {
      throw new ConvexError("password_invalid");
    }
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    passwordProvider,
    Google,
    Apple({
      profile: (appleInfo) => {
        const name = appleInfo.user
          ? `${appleInfo.user.name.firstName} ${appleInfo.user.name.lastName}`
          : undefined;

        return {
          email: appleInfo.email,
          id: appleInfo.sub,
          name,
        };
      },
    }),
  ],
});
