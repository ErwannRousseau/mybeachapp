export function isIos() {
  return process.env.EXPO_OS === "ios";
}

export function isAndroid() {
  return process.env.EXPO_OS === "android";
}
