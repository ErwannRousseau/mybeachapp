import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Introuvable" }} />
      <View style={styles.container}>
        <Text selectable style={styles.title}>
          Écran introuvable.
        </Text>
        <Link href="/" style={styles.link}>
          <Text selectable style={styles.linkText}>
            Retour à la carte
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 16,
    paddingVertical: 16,
  },
  linkText: {
    color: theme.colors.secondary,
    fontSize: 16,
  },
  title: {
    color: theme.colors.onSurface,
    fontSize: 20,
    fontWeight: "bold",
  },
}));
