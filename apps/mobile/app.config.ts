import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  android: {
    adaptiveIcon: {
      backgroundColor: "#F8FBFA",
      foregroundImage: "./assets/adaptive-icon.png",
    },
    package: "app.mybeach.mobile",
  },
  assetBundlePatterns: ["**/*"],
  experiments: {
    reactCompiler: true,
    tsconfigPaths: true,
    typedRoutes: true,
  },
  icon: "./assets/icon.png",
  ios: {
    appleTeamId: "98FD594FLL",
    bundleIdentifier: "app.mybeach.mobile",
    supportsTablet: true,
    usesAppleSignIn: true,
  },
  name: "My Beach App",
  orientation: "portrait",
  platforms: ["ios", "android"],
  plugins: [
    "expo-router",
    "@maplibre/maplibre-react-native",
    "expo-web-browser",
    "expo-apple-authentication",
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme:
          "com.googleusercontent.apps.434244613471-2qh4iolluj86n6d8otil2hs4ic071h72",
      },
    ],
    "expo-font",
    "expo-secure-store",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#F8FBFA",
        image: "./assets/splash.png",
        resizeMode: "contain",
      },
    ],
  ],
  scheme: "mybeachapp",
  slug: "mybeachapp",
  userInterfaceStyle: "automatic",
  version: "1.0.0",
  web: {
    bundler: "metro",
    favicon: "./assets/favicon.png",
    output: "static",
  },
};

export default config;
