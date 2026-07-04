import { AUTH_EMAIL_OTP_LENGTH } from "@mybeachapp/shared/auth/constants";
import { describe, expect, test, vi } from "vitest";

import {
  createEmailOtpAuthCapability,
  type EmailOtpAuthAdapter,
} from "../email-otp-capability";

function createAdapter(
  overrides: Partial<EmailOtpAuthAdapter> = {},
): EmailOtpAuthAdapter {
  return {
    getCurrentUser: vi.fn(async () => ({
      data: null,
      error: null,
    })),
    sendEmailOtp: vi.fn(async () => ({
      data: { success: true },
      error: null,
    })),
    signInWithEmailOtp: vi.fn(async () => ({
      data: {},
      error: null,
    })),
    signOut: vi.fn(async () => ({
      data: {},
      error: null,
    })),
    ...overrides,
  };
}

describe("createEmailOtpAuthCapability", () => {
  test("normalizes email before requesting an OTP", async () => {
    const adapter = createAdapter();
    const capability = createEmailOtpAuthCapability(adapter);

    const result = await capability.sendEmailOtp({
      email: "  BEACH@example.COM ",
    });

    expect(result).toEqual({
      data: { email: "beach@example.com" },
      error: null,
    });
    expect(adapter.sendEmailOtp).toHaveBeenCalledWith({
      email: "beach@example.com",
    });
  });

  test("returns French validation copy without calling the adapter", async () => {
    const adapter = createAdapter();
    const capability = createEmailOtpAuthCapability(adapter);

    const result = await capability.sendEmailOtp({ email: "beach" });

    expect(result.error?.message).toBe("Vérifie ton email.");
    expect(adapter.sendEmailOtp).not.toHaveBeenCalled();
  });

  test("maps provider rate-limit errors to French copy", async () => {
    const adapter = createAdapter({
      sendEmailOtp: vi.fn(async () => ({
        data: null,
        error: { code: "RATE_LIMIT_EXCEEDED" },
      })),
    });
    const capability = createEmailOtpAuthCapability(adapter);

    const result = await capability.sendEmailOtp({
      email: "beach@example.com",
    });

    expect(result).toEqual({
      data: null,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Attends un peu avant de réessayer.",
      },
    });
  });

  test("maps unknown provider errors to stable French copy", async () => {
    const adapter = createAdapter({
      sendEmailOtp: vi.fn(async () => ({
        data: null,
        error: {
          code: "PROVIDER_FAILURE",
          message: "Raw provider error",
        },
      })),
    });
    const capability = createEmailOtpAuthCapability(adapter);

    const result = await capability.sendEmailOtp({
      email: "beach@example.com",
    });

    expect(result).toEqual({
      data: null,
      error: {
        code: "PROVIDER_FAILURE",
        message: "Connexion impossible pour le moment.",
      },
    });
  });

  test("validates OTP shape before signing in", async () => {
    const adapter = createAdapter();
    const capability = createEmailOtpAuthCapability(adapter);

    const result = await capability.signInWithEmailOtp({
      email: "beach@example.com",
      otp: "1".repeat(AUTH_EMAIL_OTP_LENGTH - 1),
    });

    expect(result.error?.message).toBe(
      `Entre le code à ${AUTH_EMAIL_OTP_LENGTH} chiffres.`,
    );
    expect(adapter.signInWithEmailOtp).not.toHaveBeenCalled();
  });

  test("returns the current Signed-in User from the adapter session", async () => {
    const adapter = createAdapter({
      getCurrentUser: vi.fn(async () => ({
        data: {
          email: "beach@example.com",
          id: "user_123",
          name: "Beach",
        },
        error: null,
      })),
    });
    const capability = createEmailOtpAuthCapability(adapter);

    await expect(capability.getCurrentUser()).resolves.toEqual({
      data: {
        email: "beach@example.com",
        id: "user_123",
        name: "Beach",
      },
      error: null,
    });
  });

  test("signs out through the adapter", async () => {
    const adapter = createAdapter();
    const capability = createEmailOtpAuthCapability(adapter);

    await expect(capability.signOut()).resolves.toEqual({
      data: null,
      error: null,
    });
    expect(adapter.signOut).toHaveBeenCalled();
  });
});
