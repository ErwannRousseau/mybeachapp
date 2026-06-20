import { BlurView as ExpoBlurView } from "expo-blur";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { type GetProps, styled, View, YStack } from "tamagui";

const GlassViewFrame = styled(YStack, {
  borderColor: "$border",
  borderWidth: 1,
  name: "BeachNativeGlassView",
  overflow: "hidden",
  position: "relative",
});

const AndroidGlassFallback = styled(GlassViewFrame, {
  bg: "$color4",
  name: "BeachAndroidGlassFallback",
});

const GlassOverlay = styled(View, {
  b: 0,
  bg: "$transparent",
  l: 0,
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

export type GlassViewProps = Omit<
  GetProps<typeof GlassViewFrame>,
  "children"
> & {
  backgroundColor?: string;
  children?: React.ReactNode;
  intensity?: number;
  isInteractive?: boolean;
  tint?: "default" | "dark" | "light";
  tintColor?: string;
};

export function GlassView({
  backgroundColor = "rgba(255, 255, 255, 0.05)",
  children,
  intensity = 40,
  isInteractive = true,
  tint,
  tintColor,
  ...props
}: GlassViewProps) {
  const colorScheme = useColorScheme();
  const resolvedTint = tint ?? (colorScheme === "dark" ? "dark" : "light");
  const overlayStyle = {
    backgroundColor: tintColor ?? backgroundColor,
  };

  if (Platform.OS === "android") {
    return (
      <AndroidGlassFallback {...props}>
        <GlassOverlay
          pointerEvents={isInteractive ? "none" : "auto"}
          style={overlayStyle}
        />
        <GlassContent>{children}</GlassContent>
      </AndroidGlassFallback>
    );
  }

  return (
    <GlassViewFrame {...props}>
      <ExpoBlurView
        intensity={intensity}
        style={StyleSheet.absoluteFill}
        tint={resolvedTint}
      />
      <GlassOverlay
        pointerEvents={isInteractive ? "none" : "auto"}
        style={overlayStyle}
      />
      <GlassContent>{children}</GlassContent>
    </GlassViewFrame>
  );
}
