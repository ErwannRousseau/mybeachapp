import { describe, expect, it } from "vitest";

import {
  findByText,
  queryByText,
  renderWithTamagui,
} from "../../../../../test/render-with-tamagui";
import { ActivityMapPin, GPSPin, MeetingPointPin } from "../activity-map-pin";

describe("ActivityMapPin", () => {
  it("renders open, warning, full, and selected live-map pins", async () => {
    const root = await renderWithTamagui(
      <>
        <ActivityMapPin status="open">O</ActivityMapPin>
        <ActivityMapPin availability="warning" status="open">
          W
        </ActivityMapPin>
        <ActivityMapPin status="full">F</ActivityMapPin>
        <ActivityMapPin selected status="cancelled">
          S
        </ActivityMapPin>
      </>,
    );

    expect(findByText(root, "O")).toBeTruthy();
    expect(findByText(root, "W").parent?.props.className).toContain(
      "_bg-warning",
    );
    expect(findByText(root, "F")).toBeTruthy();
    expect(findByText(root, "S").parent?.props.className).toContain(
      "_bg-primary",
    );
  });

  it("hides cancelled and finished activities from live map pins", async () => {
    const root = await renderWithTamagui(
      <>
        <ActivityMapPin status="cancelled">C</ActivityMapPin>
        <ActivityMapPin status="finished">T</ActivityMapPin>
      </>,
    );

    expect(queryByText(root, "C")).toBeUndefined();
    expect(queryByText(root, "T")).toBeUndefined();
  });

  it("keeps meeting point and GPS pins available as feature pins", async () => {
    const root = await renderWithTamagui(
      <>
        <MeetingPointPin>M</MeetingPointPin>
        <GPSPin>G</GPSPin>
      </>,
    );

    expect(findByText(root, "M")).toBeTruthy();
    expect(findByText(root, "G")).toBeTruthy();
  });
});
