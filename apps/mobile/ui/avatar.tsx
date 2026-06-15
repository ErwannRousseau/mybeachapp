import { type GetProps, Image, styled, XStack } from "tamagui";

import { Text } from "./typography";

const AvatarFrame = styled(XStack, {
  bg: "$secondary",
  height: "$touchMin",
  items: "center",
  justify: "center",
  name: "BeachAvatar",
  overflow: "hidden",
  rounded: "$full",
  width: "$touchMin",
});

export type AvatarProps = GetProps<typeof AvatarFrame> & {
  children: React.ReactNode;
};

export function Avatar({ children, ...props }: AvatarProps) {
  return <AvatarFrame {...props}>{children}</AvatarFrame>;
}

const AvatarImageFrame = styled(Image, {
  height: "100%",
  name: "BeachAvatarImage",
  width: "100%",
});

export type AvatarImageProps = Omit<
  GetProps<typeof AvatarImageFrame>,
  "source"
> & {
  alt?: string;
  src: string;
};

export function AvatarImage({ alt, src, ...props }: AvatarImageProps) {
  return (
    <AvatarImageFrame
      accessibilityLabel={alt}
      source={{ uri: src }}
      {...props}
    />
  );
}

const AvatarFallbackFrame = styled(XStack, {
  height: "100%",
  items: "center",
  justify: "center",
  name: "BeachAvatarFallback",
  width: "100%",
});

export type AvatarFallbackProps = GetProps<typeof AvatarFallbackFrame> & {
  children: React.ReactNode;
};

export function AvatarFallback({ children, ...props }: AvatarFallbackProps) {
  return (
    <AvatarFallbackFrame {...props}>
      <Text size="sm" weight="semibold">
        {children}
      </Text>
    </AvatarFallbackFrame>
  );
}
