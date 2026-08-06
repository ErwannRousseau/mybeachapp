import { describe, expect, test, vi } from "vitest";

import { usePermissions } from "@/src/permissions/permissions";
import {
  findByText,
  queryByText,
  renderWithTamagui,
} from "../../../test/render-with-tamagui";
import CreateActivityScreen from "../create";

vi.mock("expo-router", () => ({
  Link: () => null,
  Stack: { Screen: () => null },
}));

vi.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
}));

vi.mock("@/src/permissions/permissions", () => ({
  usePermissions: vi.fn(),
}));

describe("CreateActivityScreen", () => {
  test("shows the access-loading state while the signed-in user profile is pending", async () => {
    vi.mocked(usePermissions).mockReturnValue({
      can: () => false,
      currentUser: { email: "beach@example.com", id: "user-1", name: null },
      isPending: true,
    });

    const root = await renderWithTamagui(<CreateActivityScreen />);

    expect(findByText(root, "Vérification de ton accès.")).toBeTruthy();
    expect(queryByText(root, "Créer une activité")).toBeUndefined();
  });
});
