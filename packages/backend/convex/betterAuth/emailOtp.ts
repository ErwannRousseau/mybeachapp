import { AUTH_EMAIL_OTP_LENGTH } from "@mybeachapp/shared/auth/constants";

import { env } from "../config/env";
import { renderAuthEmailOtp } from "./emailOtpRenderer";

type SendVerificationOtpInput = {
  email: string;
  otp: string;
  type: "change-email" | "email-verification" | "forget-password" | "sign-in";
};

const resendEmailEndpoint = "https://api.resend.com/emails";
const authEmailOtpSubject = "Ton code My Beach App";

export async function sendAuthEmailOtp(input: SendVerificationOtpInput) {
  const from =
    env.AUTH_EMAIL_FROM ?? "My Beach App <auth@auth.erwannrousseau.dev>";

  if (env.APP_ENV === "development") {
    console.info(
      "\n============================================================",
    );
    console.info(
      `[auth] Email OTP for ${input.email}: ${input.otp} (${input.type}, ${AUTH_EMAIL_OTP_LENGTH} digits)`,
    );
    console.info(
      "============================================================\n",
    );
    return;
  }

  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required to send auth email OTPs");
  }

  const response = await fetch(resendEmailEndpoint, {
    body: JSON.stringify({
      from,
      ...(await renderAuthEmailOtp({ otp: input.otp })),
      subject: authEmailOtpSubject,
      to: [input.email],
    }),
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Resend auth OTP delivery failed: ${response.status} ${body}`,
    );
  }
}
