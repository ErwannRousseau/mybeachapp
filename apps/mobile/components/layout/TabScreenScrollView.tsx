import { type GetProps, ScrollView } from "tamagui";

export type TabScreenScrollViewProps = GetProps<typeof ScrollView> & {
  bottomInset?: number;
  children: React.ReactNode;
};

export function TabScreenScrollView({
  bottomInset = 104,
  children,
  ...props
}: TabScreenScrollViewProps) {
  return (
    <ScrollView
      bg="$background"
      contentInset={{ bottom: bottomInset }}
      contentInsetAdjustmentBehavior="automatic"
      scrollIndicatorInsets={{ bottom: bottomInset }}
      {...props}
    >
      {children}
    </ScrollView>
  );
}
