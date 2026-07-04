import { describe, expect, test } from "vitest";

import { AUTH_EMAIL_OTP_LENGTH } from "../constants";
import {
  authEmailOtpRequestSchema,
  authEmailOtpSignInSchema,
} from "../schemas";

const validOtp = "1".repeat(AUTH_EMAIL_OTP_LENGTH);

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
  test("accepts a valid digit OTP", () => {
    expect(
      authEmailOtpSignInSchema.parse({
        email: "beach@example.com",
        otp: validOtp,
      }),
    ).toEqual({
      email: "beach@example.com",
      otp: validOtp,
    });
  });

  test("rejects non-digit and short OTP values", () => {
    expect(() =>
      authEmailOtpSignInSchema.parse({
        email: "beach@example.com",
        otp: `${"1".repeat(AUTH_EMAIL_OTP_LENGTH - 1)}a`,
      }),
    ).toThrow();
  });
});
