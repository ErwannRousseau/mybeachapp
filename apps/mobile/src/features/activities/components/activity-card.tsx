import type {
  ActivityCategory,
  ActivityStatus,
} from "@mybeachapp/shared/activities/types";
import { useTranslation } from "react-i18next";
import { XStack, YStack } from "tamagui";

import { getActivityCategoryLabel } from "@/src/features/activities/activity-presentation";
import { ActivityStatusTag } from "@/src/features/activities/components/activity-status-tag";
import { Card } from "@/ui/card";
import { Text, Title } from "@/ui/typography";

export type ActivityCardProps = {
  category: ActivityCategory;
  distance: string;
  participants: string;
  status: ActivityStatus;
  time: string;
  title: string;
};

export function ActivityCard({
  category,
  distance,
  participants,
  status,
  time,
  title,
}: ActivityCardProps) {
  const { t } = useTranslation();

  return (
    <Card flexDirection="row" gap="$md" minH={150} width="100%">
      <YStack bg="$muted" height={88} rounded="$md" width={88} />
      <YStack flex={1} gap="$xxs" minW={0}>
        <Text size="sm" textTransform="uppercase" variant="muted">
          {getActivityCategoryLabel(category, t)}
        </Text>
        <Title numberOfLines={2} size="sm">
          {title}
        </Title>
        <Text size="sm" variant="muted">
          {time} · {distance}
        </Text>
        <XStack items="center" justify="space-between" mt="$xs">
          <Text size="sm">{participants}</Text>
          <ActivityStatusTag status={status} />
        </XStack>
      </YStack>
    </Card>
  );
}
