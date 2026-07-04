export const AUTH_PASSWORD_MIN_LENGTH = 12;
export const AUTH_EMAIL_OTP_LENGTH = 6;
export const AUTH_EMAIL_OTP_EXPIRES_IN_SECONDS = 10 * 60;
export const AUTH_EMAIL_OTP_RESEND_AFTER_SECONDS = 30;

export const AUTH_ERROR_KEYS = {
  emailInvalid: "email_invalid",
  otpInvalid: "otp_invalid",
  passwordTooShort: "password_too_short",
} as const;
