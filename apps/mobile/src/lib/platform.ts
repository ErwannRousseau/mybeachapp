import { Platform } from "react-native";

export function isIos() {
  return process.env.EXPO_OS === "ios" || Platform.OS === "ios";
}

export function isAndroid() {
  return process.env.EXPO_OS === "android" || Platform.OS === "android";
}
