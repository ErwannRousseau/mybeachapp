import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
} from "react-native";
import { ScrollView } from "tamagui";

export type TabScreenScrollViewProps = Pick<
  ScrollViewProps,
  | "contentInset"
  | "contentInsetAdjustmentBehavior"
  | "keyboardDismissMode"
  | "keyboardShouldPersistTaps"
  | "onScroll"
  | "refreshControl"
  | "scrollEnabled"
  | "scrollEventThrottle"
  | "scrollIndicatorInsets"
  | "showsVerticalScrollIndicator"
> & {
  bottomInset?: number;
  children: React.ReactNode;
  onMomentumScrollEnd?: (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => void;
  onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
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
