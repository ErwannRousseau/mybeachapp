import { XStack, YStack } from "tamagui";

import { Card } from "@/ui/card";
import { StatusBadge, type StatusBadgeState } from "@/ui/status-badge";
import { Text, Title } from "@/ui/typography";

export type ActivityCardProps = {
  category: string;
  distance: string;
  participants: string;
  status: StatusBadgeState;
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
  return (
    <Card flexDirection="row" gap="$md" minH={150} width="100%">
      <YStack bg="$muted" height={88} rounded="$md" width={88} />
      <YStack flex={1} gap="$xxs" minW={0}>
        <Text size="sm" textTransform="uppercase" variant="muted">
          {category}
        </Text>
        <Title numberOfLines={2} size="sm">
          {title}
        </Title>
        <Text size="sm" variant="muted">
          {time} · {distance}
        </Text>
        <XStack items="center" justify="space-between" mt="$xs">
          <Text size="sm">{participants}</Text>
          <StatusBadge state={status} />
        </XStack>
      </YStack>
    </Card>
  );
}
