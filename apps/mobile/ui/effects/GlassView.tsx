import { type GetProps, styled, View, YStack } from "tamagui";

const GlassViewFrame = styled(YStack, {
  bg: "$floatingSurface",
  borderColor: "$border",
  borderWidth: 1,
  name: "BeachGlassView",
  overflow: "hidden",
  position: "relative",
});

const GlassTint = styled(View, {
  b: 0,
  bg: "$transparent",
  l: 0,
  opacity: 0.16,
  pointerEvents: "none",
  position: "absolute",
  r: 0,
  t: 0,
  z: 0,
});

const GlassContent = styled(YStack, {
  position: "relative",
  self: "stretch",
  z: 1,
});

export type GlassViewProps = GetProps<typeof GlassViewFrame> & {
  children?: React.ReactNode;
  tintColor?: string;
};

export function GlassView({ children, tintColor, ...props }: GlassViewProps) {
  const tintStyle = tintColor ? { backgroundColor: tintColor } : undefined;

  return (
    <GlassViewFrame {...props}>
      {tintColor ? <GlassTint style={tintStyle} /> : null}
      <GlassContent>{children}</GlassContent>
    </GlassViewFrame>
  );
}
