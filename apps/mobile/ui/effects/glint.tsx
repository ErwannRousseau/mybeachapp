import { type GetProps, styled, View } from "tamagui";

const GlintFrame = styled(View, {
  b: 0,
  borderColor: "$transparent",
  borderTopColor: "$surface",
  borderTopWidth: 1,
  l: 0,
  opacity: 0.72,
  pointerEvents: "none",
  position: "absolute",
  r: 0,
  t: 0,
  variants: {
    bottomShadow: {
      true: {
        boxShadow: "0 8px 18px rgba(7, 43, 59, 0.12)",
      },
    },
  } as const,
  z: 2,
});

export type GlintProps = GetProps<typeof GlintFrame>;

export function Glint(props: GlintProps) {
  return <GlintFrame {...props} />;
}
