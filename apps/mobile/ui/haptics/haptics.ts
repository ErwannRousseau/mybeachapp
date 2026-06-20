import * as ExpoHaptics from "expo-haptics";

export type ButtonHaptic = boolean | "heavy" | "light" | "medium" | "selection";

export async function lightImpact() {
  await ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light);
}

export async function mediumImpact() {
  await ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium);
}

export async function heavyImpact() {
  await ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy);
}

export async function selectionFeedback() {
  await ExpoHaptics.selectionAsync();
}

export async function successNotification() {
  await ExpoHaptics.notificationAsync(
    ExpoHaptics.NotificationFeedbackType.Success,
  );
}

export async function warningNotification() {
  await ExpoHaptics.notificationAsync(
    ExpoHaptics.NotificationFeedbackType.Warning,
  );
}

export async function errorNotification() {
  await ExpoHaptics.notificationAsync(
    ExpoHaptics.NotificationFeedbackType.Error,
  );
}

export function triggerButtonHaptic(haptic: ButtonHaptic) {
  if (!haptic) {
    return;
  }

  if (haptic === "selection") {
    void selectionFeedback();
    return;
  }

  if (haptic === "heavy") {
    void heavyImpact();
    return;
  }

  if (haptic === "medium") {
    void mediumImpact();
    return;
  }

  void lightImpact();
}
