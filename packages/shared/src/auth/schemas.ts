import { z } from "zod";

import { AUTH_ERROR_KEYS, AUTH_PASSWORD_MIN_LENGTH } from "./constants";

export const authFlowSchema: z.ZodEnum<{
  signIn: "signIn";
  signUp: "signUp";
}> = z.enum(["signIn", "signUp"]);

export const authEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: AUTH_ERROR_KEYS.emailInvalid }));

export const authPasswordSchema = z
  .string()
  .min(AUTH_PASSWORD_MIN_LENGTH, { error: AUTH_ERROR_KEYS.passwordTooShort });

export const authCredentialsSchema = z.object({
  email: authEmailSchema,
  flow: authFlowSchema,
  password: authPasswordSchema,
});
