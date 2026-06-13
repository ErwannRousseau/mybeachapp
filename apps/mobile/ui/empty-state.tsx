import { type GetProps, styled, YStack } from "tamagui";

import { Text, Title } from "./typography";

const EmptyStateFrame = styled(YStack, {
  bg: "$muted",
  borderColor: "$border",
  borderWidth: 1,
  gap: "$sm",
  items: "flex-start",
  name: "BeachEmptyState",
  p: "$lg",
  rounded: "$xl",
});

export type EmptyStateProps = GetProps<typeof EmptyStateFrame> & {
  body: string;
  title: string;
};

export function EmptyState({ body, title, ...props }: EmptyStateProps) {
  return (
    <EmptyStateFrame {...props}>
      <Title>{title}</Title>
      <Text variant="muted">{body}</Text>
    </EmptyStateFrame>
  );
}
