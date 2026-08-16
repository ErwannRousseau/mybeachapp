import * as Location from "expo-location";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const DEVICE_LOCATION_TIMEOUT_MS = 10_000;

type DevicePosition = [longitude: number, latitude: number];

export function useForegroundLocation() {
  const { t } = useTranslation();
  const [devicePosition, setDevicePosition] = useState<DevicePosition | null>(
    null,
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locationFeedback, setLocationFeedback] = useState<string | null>(null);

  async function locateDevice() {
    setIsLocating(true);
    setLocationFeedback(null);

    try {
      let permission = await Location.getForegroundPermissionsAsync();

      if (permission.status === Location.PermissionStatus.UNDETERMINED) {
        permission = await Location.requestForegroundPermissionsAsync();
      }

      if (!permission.granted) {
        setLocationFeedback(t("activities.home.locationDenied"));
        return;
      }

      const position = await getCurrentDevicePosition();
      setDevicePosition([position.coords.longitude, position.coords.latitude]);
      setLocationFeedback(t("activities.home.locationFound"));
    } catch {
      setLocationFeedback(t("activities.home.locationUnavailable"));
    } finally {
      setIsLocating(false);
    }
  }

  return {
    devicePosition,
    isLocating,
    locateDevice,
    locationFeedback,
  };
}

async function getCurrentDevicePosition() {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(reject, DEVICE_LOCATION_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
