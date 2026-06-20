import { type GetProps, styled, YStack } from "tamagui";

const CardFrame = styled(YStack, {
  bg: "$card",
  borderColor: "$border",
  borderWidth: 1,
  name: "BeachCard",
  p: "$md",
  rounded: "$xl",
});

export type CardProps = GetProps<typeof CardFrame> & {
  children?: React.ReactNode;
};

export function Card({ children, ...props }: CardProps) {
  return <CardFrame {...props}>{children}</CardFrame>;
}
