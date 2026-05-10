module.exports = (api) => {
  api.cache(true);
  const plugins = [];

  plugins.push("react-native-worklets/plugin");

  plugins.push([
    "react-native-unistyles/plugin",
    {
      autoProcessImports: ["@/components"],
      root: "app",
    },
  ]);

  return {
    plugins,
    presets: ["babel-preset-expo"],
  };
};
