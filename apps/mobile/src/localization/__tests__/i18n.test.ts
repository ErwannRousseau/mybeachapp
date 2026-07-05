import { describe, expect, test } from "vitest";

import { DEFAULT_LOCALE, i18n, localeLabels, SUPPORTED_LOCALES } from "../i18n";

describe("mobile localization", () => {
  test("uses French as the only supported MVP locale", () => {
    expect(DEFAULT_LOCALE).toBe("fr");
    expect(SUPPORTED_LOCALES).toEqual(["fr"]);
    expect(localeLabels.fr).toBe("Français");
  });

  test("translates interface copy and system data labels", () => {
    expect(i18n.t("navigation.profile")).toBe("Profil");
    expect(i18n.t("activities.categories.ball_sport")).toBe("Sports de ballon");
    expect(i18n.t("activities.status.open")).toBe("Ouvert");
  });
});
