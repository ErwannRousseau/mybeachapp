import { vi } from "vitest";

import "@/src/localization/i18n";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

Object.defineProperty(globalThis, "__DEV__", {
  configurable: true,
  value: true,
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("expo-haptics", () => ({
  ImpactFeedbackStyle: {
    Heavy: "heavy",
    Light: "light",
    Medium: "medium",
  },
  impactAsync: vi.fn(),
  NotificationFeedbackType: {
    Error: "error",
    Success: "success",
    Warning: "warning",
  },
  notificationAsync: vi.fn(),
  selectionAsync: vi.fn(),
}));

vi.mock("expo-blur", () => ({
  BlurTargetView: "BlurTargetView",
  BlurView: "BlurView",
}));

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: (query: string) => ({
    addEventListener: () => undefined,
    addListener: () => undefined,
    dispatchEvent: () => false,
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: () => undefined,
    removeListener: () => undefined,
  }),
});
