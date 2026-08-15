import { Stack } from "expo-router";

import { PrototypeMapScreen } from "@/src/features/map/prototype-map-screen";

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PrototypeMapScreen />
    </>
  );
}
