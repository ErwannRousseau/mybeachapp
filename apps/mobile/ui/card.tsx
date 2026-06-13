import { type GetProps, styled, YStack } from "tamagui";

export type CardVariant = "default" | "floating" | "soft";

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

const FloatingSurfaceFrame = styled(SurfaceFrame, {
  bg: "$floatingSurface",
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

const CardFrame = styled(SurfaceFrame, {
  bg: "$card",
  variants: {
    variant: {
      default: {
        bg: "$card",
      },
      floating: {
        bg: "$floatingSurface",
        shadowColor: "$foreground",
        shadowOffset: { height: 16, width: 0 },
        shadowOpacity: 0.14,
        shadowRadius: 36,
      },
      soft: {
        bg: "$muted",
      },
    },
  } as const,
});

export type CardProps = GetProps<typeof CardFrame> & {
  children?: React.ReactNode;
  variant?: CardVariant;
};

export function Card({ children, variant = "default", ...props }: CardProps) {
  return (
    <CardFrame variant={variant} {...props}>
      {children}
    </CardFrame>
  );
}
