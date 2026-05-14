import { type Validator, type VLiteral, v } from "convex/values";

export function literalUnion<T extends readonly [string, string, ...string[]]>(
  values: T,
): Validator<T[number]> {
  const literals = values.map((value) => v.literal(value)) as unknown as [
    VLiteral<T[number]>,
    VLiteral<T[number]>,
    ...VLiteral<T[number]>[],
  ];
  return v.union(...literals) as Validator<T[number]>;
}
