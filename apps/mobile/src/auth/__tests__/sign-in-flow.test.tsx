import { act } from "react";
import { useController } from "react-hook-form";
import { createRoot } from "test-renderer";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { emailOtpAuthCapability } from "../email-otp-capability";
import {
  type SignInFormValues,
  type UseSignInFlowResult,
  useSignInFlow,
} from "../sign-in-flow";

vi.mock("expo-router", () => ({
  router: {
    replace: vi.fn(),
  },
}));

vi.mock("../email-otp-capability", () => ({
  emailOtpAuthCapability: {
    getCurrentUser: vi.fn(),
    sendEmailOtp: vi.fn(),
    signInWithEmailOtp: vi.fn(),
    signOut: vi.fn(),
  },
}));

vi.mock("../session", () => ({
  hasNativeAppleAuthProvider: () => false,
  hasNativeGoogleAuthProvider: () => false,
  signInWithSocial: vi.fn(),
}));

describe("useSignInFlow", () => {
  beforeEach(() => {
    vi.mocked(emailOtpAuthCapability.sendEmailOtp).mockResolvedValue({
      data: { email: "beach@example.com" },
      error: null,
    });
  });

  test("notifies OTP step start before exposing the OTP screen state", async () => {
    const events: string[] = [];
    let flow: UseSignInFlowResult | null = null;
    let isOtpStep = false;
    let setEmail: ((value: string) => void) | null = null;
    const root = createRoot();

    function TestHarness() {
      flow = useSignInFlow({
        onOtpStepStarted: () => {
          events.push(`callback:${String(isOtpStep)}`);
        },
      });
      isOtpStep = flow.isOtpStep;
      const {
        field: { onChange },
      } = useController<SignInFormValues>({
        control: flow.control,
        name: "email",
      });
      setEmail = onChange;

      return null;
    }

    await act(async () => {
      root.render(<TestHarness />);
    });

    await act(async () => {
      setEmail?.("beach@example.com");
    });

    await act(async () => {
      await flow?.submitEmailOtp();
    });

    expect(events).toEqual(["callback:false"]);
    expect(isOtpStep).toBe(true);
  });
});
