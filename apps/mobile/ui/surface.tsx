import { type GetProps, styled, YStack } from "tamagui";

const SurfaceFrame = styled(YStack, {
  bg: "$surface",
  borderColor: "$border",
  borderWidth: 1,
  name: "BeachSurface",
  p: "$md",
  rounded: "$xl",
});

export type SurfaceProps = GetProps<typeof SurfaceFrame> & {
  children?: React.ReactNode;
};

export function Surface({ children, ...props }: SurfaceProps) {
  return <SurfaceFrame {...props}>{children}</SurfaceFrame>;
}

const FloatingSurfaceFrame = styled(YStack, {
  bg: "$floatingSurface",
  borderColor: "$border",
  borderWidth: 1,
  name: "BeachFloatingSurface",
  p: "$md",
  rounded: "$xl",
  shadowColor: "$foreground",
  shadowOffset: { height: 16, width: 0 },
  shadowOpacity: 0.14,
  shadowRadius: 36,
});

export type FloatingSurfaceProps = GetProps<typeof FloatingSurfaceFrame> & {
  children?: React.ReactNode;
};

export function FloatingSurface({ children, ...props }: FloatingSurfaceProps) {
  return <FloatingSurfaceFrame {...props}>{children}</FloatingSurfaceFrame>;
}
