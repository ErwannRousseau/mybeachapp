import { type GetProps, styled, Button as TamaguiButton } from "tamagui";

const FilterChipFrame = styled(TamaguiButton, {
  bg: "$surface",
  borderColor: "$border",
  borderWidth: 1,
  color: "$surfaceForeground",
  fontSize: 13,
  fontWeight: "500",
  items: "center",
  justify: "center",
  minH: 36,
  name: "BeachFilterChip",
  pressStyle: {
    opacity: 0.82,
  },
  px: 12,
  rounded: "$full",
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

export type FilterChipProps = GetProps<typeof FilterChipFrame> & {
  children: React.ReactNode;
  selected?: boolean;
};

export function FilterChip({
  children,
  selected = false,
  ...props
}: FilterChipProps) {
  return (
    <FilterChipFrame selected={selected} {...props}>
      {children}
    </FilterChipFrame>
  );
}
