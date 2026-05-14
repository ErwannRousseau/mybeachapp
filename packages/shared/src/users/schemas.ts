import { z } from "zod";

import { USER_ROLES, USER_STATUSES } from "./constants";

export const userRoleSchema = z.enum(USER_ROLES);
export const userStatusSchema = z.enum(USER_STATUSES);
