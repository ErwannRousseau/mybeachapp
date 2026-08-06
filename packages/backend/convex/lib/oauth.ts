export function compactUnique(values: Array<string | undefined>) {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value))),
  );
}

export function providerClientId(values: Array<string | undefined>) {
  const clientIds = compactUnique(values);

  if (clientIds.length === 0) {
    return undefined;
  }

  return clientIds.length === 1 ? clientIds[0] : clientIds;
}

type AppleIdTokenInput = {
  idToken?: string | undefined;
  user?:
    | {
        email?: string | undefined;
        name?:
          | {
              firstName?: string | undefined;
              lastName?: string | undefined;
            }
          | undefined;
      }
    | undefined;
};

type AppleIdTokenProfile = {
  email?: unknown;
  email_verified?: unknown;
  name?: unknown;
  sub?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function decodeJwtPayload(token: string) {
  const payload = token.split(".")[1];

  if (!payload) {
    return null;
  }

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded: unknown = JSON.parse(atob(padded));

    return isRecord(decoded) ? (decoded as AppleIdTokenProfile) : null;
  } catch {
    return null;
  }
}

function getAppleCredentialName(user: AppleIdTokenInput["user"]) {
  const name = user?.name;
  const fullName = [name?.firstName, name?.lastName]
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .trim();

  return fullName || undefined;
}

export async function getAppleUserInfoFromIdToken(token: AppleIdTokenInput) {
  if (!token.idToken) {
    return null;
  }

  const profile = decodeJwtPayload(token.idToken);

  if (!profile || typeof profile.sub !== "string") {
    return null;
  }

  const email =
    typeof profile.email === "string" ? profile.email : token.user?.email;
  const name =
    getAppleCredentialName(token.user) ??
    (typeof profile.name === "string" ? profile.name : "");
  const emailVerified =
    typeof profile.email_verified === "boolean"
      ? profile.email_verified
      : profile.email_verified === "true";

  return {
    data: {
      ...profile,
      email,
      name,
    },
    user: {
      email: email ?? null,
      emailVerified,
      id: profile.sub,
      name,
    },
  };
}
