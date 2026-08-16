import { describe, expect, it } from "vitest";

import { i18n } from "@/src/localization/i18n";

import {
  formatActivityStartTime,
  getActivityCategoryLabel,
  getActivityStatusPresentation,
} from "../activity-presentation";

const t = i18n.getFixedT("fr");

describe("activity presentation", () => {
  it("formats activity times with the selected locale", () => {
    const startDateTime = new Date(2026, 7, 16, 14, 5).getTime();

    expect(formatActivityStartTime(startDateTime, "fr")).toContain("août");
    expect(formatActivityStartTime(startDateTime, "en")).toContain("Aug");
  });

  it.each([
    ["ball_sport", "Sports de ballon"],
    ["water_sport", "Sports nautiques"],
    ["racket_sport", "Raquettes"],
    ["fitness_wellness", "Fitness"],
    ["walking_running", "Marche"],
    ["beach_games", "Jeux de plage"],
    ["social", "Social"],
    ["other", "Autre"],
  ] as const)("labels %s in French", (category, expectedLabel) => {
    // Given a supported Activity Category and the French translator

    // When its presentation label is requested
    const label = getActivityCategoryLabel(category, t);

    // Then the public interface returns the established French copy
    expect(label).toBe(expectedLabel);
  });

  it.each([
    [
      "open",
      {
        baseMapPinVisibility: "visible",
        label: "Ouvert",
        tagTone: "success",
      },
    ],
    [
      "full",
      {
        baseMapPinVisibility: "visible",
        label: "Complet",
        tagTone: "muted",
      },
    ],
    [
      "cancelled",
      {
        baseMapPinVisibility: "hidden",
        label: "Annulé",
        tagTone: "destructive",
      },
    ],
    [
      "finished",
      {
        baseMapPinVisibility: "hidden",
        label: "Terminé",
        tagTone: "muted",
      },
    ],
  ] as const)("presents %s status", (status, expectedPresentation) => {
    // Given a supported Activity Status and the French translator

    // When its presentation is requested
    const presentation = getActivityStatusPresentation(status, t);

    // Then label, tag tone, and base map visibility match the product matrix
    expect(presentation).toEqual(expectedPresentation);
  });
});
