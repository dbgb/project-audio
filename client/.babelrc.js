const presets = ["@babel/preset-react"];

const plugins = [
  [
    // Allow babel to optimize top-level import load times in dev environment
    // via tree-shaking (Occurs by default for production builds)
    // re: https://material-ui.com/guides/minimizing-bundle-size/#option-2
    "babel-plugin-import",
    {
      libraryName: "@material-ui/core",
      libraryDirectory: "esm",
      camel2DashComponentName: false,
    },
    "core",
  ],
  [
    "babel-plugin-import",
    {
      libraryName: "@material-ui/icons",
      libraryDirectory: "esm",
      camel2DashComponentName: false,
    },
    "icons",
  ],
];

module.exports = { plugins, presets };
