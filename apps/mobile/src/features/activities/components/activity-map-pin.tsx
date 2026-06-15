import type { ActivityStatus } from "@mybeachapp/shared/activities/types";
import { type GetProps, styled, XStack } from "tamagui";

import { Text } from "@/ui/typography";

import {
  type ActivityStatusTone,
  getActivityStatusTone,
} from "./activity-status-tone";

type ActivityMapPinTone = ActivityStatusTone | "selected";

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
    },
  } as const,
  width: 44,
});

export type ActivityMapPinProps = GetProps<typeof ActivityMapPinFrame> & {
  children?: React.ReactNode;
  selected?: boolean;
  status: ActivityStatus;
};

export function ActivityMapPin({
  children,
  selected = false,
  status,
  ...props
}: ActivityMapPinProps) {
  const tone = selected ? "selected" : getActivityStatusTone(status);

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
    case "destructive":
      return "$destructiveForeground";
    case "muted":
      return "$foreground";
    case "selected":
      return "$secondaryForeground";
    case "success":
      return "$foreground";
  }
}
