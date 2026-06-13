import { type GetProps, Image, styled, XStack } from "tamagui";

import { Text } from "./typography";

const AvatarFrame = styled(XStack, {
  bg: "$secondary",
  height: 44,
  items: "center",
  justify: "center",
  name: "BeachAvatar",
  overflow: "hidden",
  rounded: "$full",
  width: 44,
});

export type AvatarProps = GetProps<typeof AvatarFrame> & {
  alt?: string;
  fallback?: string;
  src?: string;
};

export function Avatar({ alt, fallback, src, ...props }: AvatarProps) {
  return (
    <AvatarFrame {...props}>
      {src ? (
        <Image
          accessibilityLabel={alt}
          height="100%"
          source={{ uri: src }}
          width="100%"
        />
      ) : (
        <Text size="sm" weight="semibold">
          {fallback}
        </Text>
      )}
    </AvatarFrame>
  );
}
