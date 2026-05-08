type ConvexContext = {
  db: {
    get: (id: unknown) => Promise<unknown>;
    insert: (table: string, value: unknown) => Promise<unknown>;
    query: (table: string) => {
      order: (direction: "asc" | "desc") => { take: (limit: number) => Promise<unknown[]> };
      withIndex: (
        name: string,
        callback: (builder: { eq: (field: string, value: unknown) => unknown }) => unknown
      ) => { unique: () => Promise<unknown> };
    };
  };
  storage: {
    generateUploadUrl: () => Promise<string>;
  };
};

type FunctionDefinition = {
  args: unknown;
  handler: (ctx: ConvexContext, args: any) => unknown;
};

export function query<TDefinition extends FunctionDefinition>(
  definition: TDefinition
): TDefinition {
  return definition;
}

export function mutation<TDefinition extends FunctionDefinition>(
  definition: TDefinition
): TDefinition {
  return definition;
}
