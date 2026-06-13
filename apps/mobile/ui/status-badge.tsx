import { type GetProps, styled, XStack } from "tamagui";

import { Text } from "./typography";

export type StatusBadgeState = "cancelled" | "full" | "open" | "warning";

const StatusBadgeFrame = styled(XStack, {
  bg: "$successSoft",
  items: "center",
  minH: 28,
  name: "BeachStatusBadge",
  px: "$xs",
  rounded: "$full",
  variants: {
    state: {
      cancelled: {
        bg: "$destructiveSoft",
      },
      full: {
        bg: "$muted",
      },
      open: {
        bg: "$successSoft",
      },
      warning: {
        bg: "$warningSoft",
      },
    },
  } as const,
});

export type StatusBadgeProps = GetProps<typeof StatusBadgeFrame> & {
  state?: StatusBadgeState;
};

export function StatusBadge({ state = "open", ...props }: StatusBadgeProps) {
  const label =
    state === "cancelled"
      ? "Annulé"
      : state === "full"
        ? "Complet"
        : state === "warning"
          ? "Presque complet"
          : "Ouvert";

  return (
    <StatusBadgeFrame state={state} {...props}>
      <Text size="sm" weight="medium">
        {label}
      </Text>
    </StatusBadgeFrame>
  );
}
