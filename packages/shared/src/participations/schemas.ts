import { z } from "zod";

import { PARTICIPATION_STATUSES } from "./constants";

export const participationStatusSchema = z.enum(PARTICIPATION_STATUSES);
