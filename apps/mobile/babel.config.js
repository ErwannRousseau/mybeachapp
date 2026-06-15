module.exports = (api) => {
  api.cache(true);

  return {
    plugins: [
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui", "@tamagui/core"],
          config: "./tamagui.config.ts",
          disableExtraction: process.env.NODE_ENV === "development",
          logTimings: true,
        },
      ],
      "react-native-worklets/plugin",
    ],
    presets: ["babel-preset-expo"],
  };
};
