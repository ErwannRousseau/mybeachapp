import { type GetProps, styled, Button as TamaguiButton } from "tamagui";

const ChipFrame = styled(TamaguiButton, {
  bg: "$surface",
  borderColor: "$border",
  borderWidth: 1,
  color: "$surfaceForeground",
  fontSize: "$labelMd",
  fontWeight: "500",
  items: "center",
  justify: "center",
  minH: "$touchMin",
  name: "BeachChip",
  pressStyle: {
    opacity: 0.82,
  },
  px: "$md",
  rounded: "$full",
  self: "flex-start",
  unstyled: true,
  variants: {
    selected: {
      true: {
        bg: "$secondary",
        borderColor: "$secondary",
        color: "$secondaryForeground",
      },
    },
  } as const,
  width: "auto",
});

export type ChipProps = GetProps<typeof ChipFrame> & {
  children: React.ReactNode;
  selected?: boolean;
};

export function Chip({ children, selected = false, ...props }: ChipProps) {
  return (
    <ChipFrame selected={selected} {...props}>
      {children}
    </ChipFrame>
  );
}
