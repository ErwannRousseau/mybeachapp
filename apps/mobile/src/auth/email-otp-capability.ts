import {
  AUTH_EMAIL_OTP_LENGTH,
  AUTH_ERROR_KEYS,
} from "@mybeachapp/shared/auth/constants";
import {
  authEmailOtpRequestSchema,
  authEmailOtpSignInSchema,
} from "@mybeachapp/shared/auth/schemas";
import type {
  AuthEmailOtpRequest,
  AuthEmailOtpSignIn,
} from "@mybeachapp/shared/auth/types";

import { translate } from "@/src/localization/i18n";

export type AuthCapabilityError = {
  code: string;
  message: string;
};

type AuthCapabilityResult<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: AuthCapabilityError;
    };

type AuthAdapterError = {
  code?: string;
  message?: string;
  status?: number;
};

type AuthAdapterResponse<T> = {
  data: T | null;
  error: AuthAdapterError | null;
};

type AuthSessionUser = {
  email?: null | string;
  id: string;
  name?: null | string;
};

export type CurrentSignedInUser = {
  email: null | string;
  id: string;
  name: null | string;
};

export type EmailOtpAuthAdapter = {
  getCurrentUser: () => Promise<AuthAdapterResponse<AuthSessionUser>>;
  sendEmailOtp: (
    input: AuthEmailOtpRequest,
  ) => Promise<AuthAdapterResponse<{ success?: boolean }>>;
  signInWithEmailOtp: (
    input: AuthEmailOtpSignIn,
  ) => Promise<AuthAdapterResponse<unknown>>;
  signOut: () => Promise<AuthAdapterResponse<unknown>>;
};

export type EmailOtpAuthCapability = {
  getCurrentUser: () => Promise<
    AuthCapabilityResult<CurrentSignedInUser | null>
  >;
  sendEmailOtp: (
    input: AuthEmailOtpRequest,
  ) => Promise<AuthCapabilityResult<{ email: string }>>;
  signInWithEmailOtp: (
    input: AuthEmailOtpSignIn,
  ) => Promise<AuthCapabilityResult<{ email: string }>>;
  signOut: () => Promise<AuthCapabilityResult<null>>;
};

function mapValidationError(errorKey: string | undefined) {
  switch (errorKey) {
    case AUTH_ERROR_KEYS.emailInvalid:
      return translate("auth.errors.emailInvalid");
    case AUTH_ERROR_KEYS.otpInvalid:
      return translate("auth.errors.otpLength", {
        length: AUTH_EMAIL_OTP_LENGTH,
      });
    default:
      return translate("auth.errors.validation");
  }
}

function mapProviderError(error: AuthAdapterError | null | undefined) {
  switch (error?.code) {
    case "INVALID_EMAIL":
      return translate("auth.errors.emailInvalid");
    case "INVALID_OTP":
      return translate("auth.errors.otpInvalid");
    case "OTP_EXPIRED":
      return translate("auth.errors.otpExpired");
    case "RATE_LIMIT_EXCEEDED":
    case "TOO_MANY_REQUESTS":
      return translate("auth.errors.rateLimit");
    default:
      return translate("auth.errors.generic");
  }
}

function validationFailure(errorKey: string | undefined) {
  return {
    data: null,
    error: {
      code: errorKey ?? "validation_error",
      message: mapValidationError(errorKey),
    },
  } satisfies AuthCapabilityResult<never>;
}

function providerFailure(error: AuthAdapterError | null | undefined) {
  return {
    data: null,
    error: {
      code: error?.code ?? "auth_provider_error",
      message: mapProviderError(error),
    },
  } satisfies AuthCapabilityResult<never>;
}

function getFirstValidationKey(
  issues: { message: string }[],
): string | undefined {
  return issues[0]?.message;
}

function toCurrentSignedInUser(
  user: AuthSessionUser | null,
): CurrentSignedInUser | null {
  if (!user) {
    return null;
  }

  return {
    email: user.email ?? null,
    id: user.id,
    name: user.name ?? null,
  };
}

export function createEmailOtpAuthCapability(
  adapter: EmailOtpAuthAdapter,
): EmailOtpAuthCapability {
  return {
    async getCurrentUser() {
      const response = await adapter.getCurrentUser();

      if (response.error) {
        return providerFailure(response.error);
      }

      return {
        data: toCurrentSignedInUser(response.data),
        error: null,
      };
    },

    async sendEmailOtp(input) {
      const result = authEmailOtpRequestSchema.safeParse(input);

      if (!result.success) {
        return validationFailure(getFirstValidationKey(result.error.issues));
      }

      const response = await adapter.sendEmailOtp(result.data);

      if (response.error) {
        return providerFailure(response.error);
      }

      return {
        data: { email: result.data.email },
        error: null,
      };
    },

    async signInWithEmailOtp(input) {
      const result = authEmailOtpSignInSchema.safeParse(input);

      if (!result.success) {
        return validationFailure(getFirstValidationKey(result.error.issues));
      }

      const response = await adapter.signInWithEmailOtp(result.data);

      if (response.error) {
        return providerFailure(response.error);
      }

      return {
        data: { email: result.data.email },
        error: null,
      };
    },

    async signOut() {
      const response = await adapter.signOut();

      if (response.error) {
        return providerFailure(response.error);
      }

      return {
        data: null,
        error: null,
      };
    },
  };
}

export const emailOtpAuthCapability = createEmailOtpAuthCapability({
  async getCurrentUser() {
    const { authClient } = await import("./auth-client");
    const response = await authClient.getSession();

    return {
      data: response.data?.user ?? null,
      error: response.error,
    };
  },
  async sendEmailOtp(input) {
    const { authClient } = await import("./auth-client");
    return await authClient.emailOtp.sendVerificationOtp({
      email: input.email,
      type: "sign-in",
    });
  },
  async signInWithEmailOtp(input) {
    const { authClient } = await import("./auth-client");
    return await authClient.signIn.emailOtp({
      email: input.email,
      otp: input.otp,
    });
  },
  async signOut() {
    const { authClient } = await import("./auth-client");
    return await authClient.signOut();
  },
});
