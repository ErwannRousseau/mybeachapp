import { render } from "react-email";

import {
  AuthEmailOtpTemplate,
  type AuthEmailOtpTemplateProps,
} from "./emailOtpTemplate";

export async function renderAuthEmailOtp(input: AuthEmailOtpTemplateProps) {
  const email = <AuthEmailOtpTemplate otp={input.otp} />;

  const [html, text] = await Promise.all([
    render(email),
    render(email, { plainText: true }),
  ]);

  return { html, text };
}
