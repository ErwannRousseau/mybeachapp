module.exports = (api) => {
  api.cache(true);
  const plugins = [];

  plugins.push([
    "react-native-unistyles/plugin",
    {
      autoProcessImports: ["@/components"],
      autoProcessRoot: "app",
    },
  ]);

  plugins.push("react-native-worklets/plugin");

  return {
    plugins,
    presets: ["babel-preset-expo"],
  };
};
