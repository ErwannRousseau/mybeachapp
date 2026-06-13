import { YStack } from "tamagui";

export function Container({ children }: React.PropsWithChildren) {
  return (
    <YStack bg="$background" flex={1} p="$md">
      {children}
    </YStack>
  );
}
