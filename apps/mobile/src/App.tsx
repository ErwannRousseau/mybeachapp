import { ACTIVITY_CATEGORIES } from "@mybeach/shared";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>MVP mobile</Text>
        <Text style={styles.title}>My Beach App</Text>
        <Text style={styles.body}>
          Base Expo + React Native prete pour la carte, la creation d'activite
          et le client Convex.
        </Text>
        <Text style={styles.meta}>
          {ACTIVITY_CATEGORIES.length} categories partagees chargees.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    color: "#062A3B",
    fontSize: 16,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    gap: 12,
    justifyContent: "center",
    padding: 24,
  },
  eyebrow: {
    color: "#0077B6",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  meta: {
    color: "#6B7C86",
    fontSize: 13,
    fontWeight: "500",
  },
  screen: {
    backgroundColor: "#F8FBFA",
    flex: 1,
  },
  title: {
    color: "#062A3B",
    fontSize: 32,
    fontWeight: "700",
  },
});
