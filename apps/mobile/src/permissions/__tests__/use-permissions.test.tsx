import { act } from "react";
import { createRoot } from "test-renderer";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { useAuthSession } from "@/src/auth/session";

import { usePermissions } from "../permissions";

vi.mock("@/src/auth/session", () => ({
  useAuthSession: vi.fn(),
}));

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
}));

describe("usePermissions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("denies activity creation while the signed-in user profile query is pending", async () => {
    const { useQuery } = await import("convex/react");
    let canCreate = true;
    let isPending = false;

    vi.mocked(useAuthSession).mockReturnValue({
      data: { email: "beach@example.com", id: "user-1", name: null },
      isPending: false,
    });
    vi.mocked(useQuery).mockReturnValue(undefined);

    function TestHarness() {
      const permissions = usePermissions();

      canCreate = permissions.can("activity.create");
      isPending = permissions.isPending;

      return null;
    }

    const root = createRoot();

    await act(async () => {
      root.render(<TestHarness />);
    });

    expect(isPending).toBe(true);
    expect(canCreate).toBe(false);
  });
});
