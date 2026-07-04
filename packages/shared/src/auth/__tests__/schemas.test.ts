import { describe, expect, test } from "vitest";

import {
  authCredentialsSchema,
  authEmailOtpRequestSchema,
  authEmailOtpSignInSchema,
} from "../schemas";

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

describe("authEmailOtpRequestSchema", () => {
  test("normalizes email", () => {
    expect(
      authEmailOtpRequestSchema.parse({
        email: "  BEACH@example.COM ",
      }),
    ).toEqual({
      email: "beach@example.com",
    });
  });
});

describe("authEmailOtpSignInSchema", () => {
  test("accepts a 6 digit OTP", () => {
    expect(
      authEmailOtpSignInSchema.parse({
        email: "beach@example.com",
        otp: "123456",
      }),
    ).toEqual({
      email: "beach@example.com",
      otp: "123456",
    });
  });

  test("rejects non-digit and short OTP values", () => {
    expect(() =>
      authEmailOtpSignInSchema.parse({
        email: "beach@example.com",
        otp: "12345a",
      }),
    ).toThrow();
  });
});
