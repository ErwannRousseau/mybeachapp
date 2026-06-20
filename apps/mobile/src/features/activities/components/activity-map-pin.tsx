import type { ActivityStatus } from "@mybeachapp/shared/activities/types";
import { type GetProps, styled, XStack } from "tamagui";

import { Text } from "@/ui/typography";

import { getActivityStatusTone } from "./activity-status-tone";

export type ActivityMapPinAvailability = "open" | "warning";
type ActivityMapPinTone = "muted" | "selected" | "success" | "warning";

const ActivityMapPinFrame = styled(XStack, {
  bg: "$surface",
  borderColor: "$border",
  borderWidth: 1,
  height: 44,
  items: "center",
  justify: "center",
  name: "BeachActivityMapPin",
  rounded: "$full",
  variants: {
    tone: {
      destructive: {
        bg: "$destructiveSoft",
        borderColor: "$destructive",
      },
      muted: {
        bg: "$muted",
        borderColor: "$border",
      },
      selected: {
        bg: "$accent",
        borderColor: "$accent",
      },
      success: {
        bg: "$successSoft",
        borderColor: "$success",
      },
      warning: {
        bg: "$warning",
        borderColor: "$warning",
      },
    },
  } as const,
  width: 44,
});

export type ActivityMapPinProps = GetProps<typeof ActivityMapPinFrame> & {
  availability?: ActivityMapPinAvailability;
  children?: React.ReactNode;
  selected?: boolean;
  status: ActivityStatus;
};

export function ActivityMapPin({
  availability = "open",
  children,
  selected = false,
  status,
  ...props
}: ActivityMapPinProps) {
  const tone = selected
    ? "selected"
    : getActivityMapPinTone(status, availability);

  if (!tone) {
    return null;
  }

  return (
    <ActivityMapPinFrame tone={tone} {...props}>
      <Text
        color={getActivityMapPinTextColor(tone)}
        size="sm"
        weight="semibold"
      >
        {children}
      </Text>
    </ActivityMapPinFrame>
  );
}

const MeetingPointPinFrame = styled(XStack, {
  bg: "$accent",
  borderColor: "$accent",
  borderWidth: 1,
  height: 44,
  items: "center",
  justify: "center",
  name: "BeachMeetingPointPin",
  rounded: "$full",
  width: 44,
});

export type MeetingPointPinProps = GetProps<typeof MeetingPointPinFrame> & {
  children?: React.ReactNode;
};

export function MeetingPointPin({ children, ...props }: MeetingPointPinProps) {
  return (
    <MeetingPointPinFrame {...props}>
      <Text color="$secondaryForeground" size="sm" weight="semibold">
        {children}
      </Text>
    </MeetingPointPinFrame>
  );
}

const GPSPinFrame = styled(XStack, {
  bg: "$surface",
  borderColor: "$accent",
  borderWidth: 2,
  height: 44,
  items: "center",
  justify: "center",
  name: "BeachGPSPin",
  rounded: "$full",
  width: 44,
});

export type GPSPinProps = GetProps<typeof GPSPinFrame> & {
  children?: React.ReactNode;
};

export function GPSPin({ children, ...props }: GPSPinProps) {
  return (
    <GPSPinFrame {...props}>
      <Text color="$accent" size="sm" weight="semibold">
        {children}
      </Text>
    </GPSPinFrame>
  );
}

function getActivityMapPinTextColor(tone: ActivityMapPinTone) {
  switch (tone) {
    case "muted":
      return "$foreground";
    case "selected":
      return "$secondaryForeground";
    case "success":
      return "$foreground";
    case "warning":
      return "$warningForeground";
  }
}

function getActivityMapPinTone(
  status: ActivityStatus,
  availability: ActivityMapPinAvailability,
): ActivityMapPinTone | null {
  const statusTone = getActivityStatusTone(status);

  switch (statusTone) {
    case "destructive":
      return null;
    case "muted":
      return status === "full" ? "muted" : null;
    case "success":
      return availability === "warning" ? "warning" : "success";
  }
}
