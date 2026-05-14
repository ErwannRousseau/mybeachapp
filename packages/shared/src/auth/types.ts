import type { z } from "zod";

import type { authCredentialsSchema, authFlowSchema } from "./schemas";

export type AuthFlow = z.infer<typeof authFlowSchema>;
export type AuthCredentials = z.infer<typeof authCredentialsSchema>;
