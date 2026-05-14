import { z } from "zod";

export const AUTH_PASSWORD_MIN_LENGTH = 8;

export const authFlowSchema = z.enum(["signIn", "signUp"]);

export const authEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "email_invalid" }));

export const authPasswordSchema = z
  .string()
  .min(AUTH_PASSWORD_MIN_LENGTH, { error: "password_too_short" });

export const authCredentialsSchema = z.object({
  email: authEmailSchema,
  flow: authFlowSchema,
  password: authPasswordSchema,
});
