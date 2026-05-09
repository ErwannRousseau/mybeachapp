import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { Ref } from "react";
import { Pressable, StyleSheet, type View } from "react-native";

type HeaderButtonProps = {
  onPress?: () => void;
  ref?: Ref<View>;
};

export function HeaderButton({ onPress, ref }: HeaderButtonProps) {
  return (
    <Pressable onPress={onPress} ref={ref}>
      {({ pressed }) => (
        <FontAwesome
          color="gray"
          name="info-circle"
          size={25}
          style={[
            styles.headerRight,
            {
              opacity: pressed ? 0.5 : 1,
            },
          ]}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 15,
  },
});
