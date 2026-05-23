import { describe, expect, test } from "vitest";

import { authCredentialsSchema } from "./schemas";

describe("authCredentialsSchema", () => {
  test("normalizes email and accepts valid credentials", () => {
    expect(
      authCredentialsSchema.parse({
        email: "  BEACH@example.COM ",
        flow: "signUp",
        password: "password1234",
      }),
    ).toEqual({
      email: "beach@example.com",
      flow: "signUp",
      password: "password1234",
    });
  });

  test("rejects invalid email and short password", () => {
    expect(() =>
      authCredentialsSchema.parse({
        email: "beach",
        flow: "signIn",
        password: "short",
      }),
    ).toThrow();
  });
});
