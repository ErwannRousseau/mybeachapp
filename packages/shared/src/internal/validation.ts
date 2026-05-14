import type { z } from "zod";

export interface ValidationError {
  field: string;
  message: string;
}

export function isOneOf<const T extends readonly string[]>(
  values: T,
  value: unknown,
): value is T[number] {
  return typeof value === "string" && values.includes(value as T[number]);
}

export function zodIssuesToValidationErrors(
  issues: readonly z.core.$ZodIssue[],
): ValidationError[] {
  return issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
