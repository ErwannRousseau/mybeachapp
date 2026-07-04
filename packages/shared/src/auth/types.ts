import type { z } from "zod";

import type {
  authEmailOtpRequestSchema,
  authEmailOtpSignInSchema,
  authFlowSchema,
} from "./schemas";

export type AuthFlow = z.infer<typeof authFlowSchema>;
export type AuthEmailOtpRequest = z.infer<typeof authEmailOtpRequestSchema>;
export type AuthEmailOtpSignIn = z.infer<typeof authEmailOtpSignInSchema>;
