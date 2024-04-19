const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: "XViewer",
    libraryTarget: "umd",
    umdNamedDefine: true,
    libraryExport: "default",
    crossOriginLoading: "anonymous",
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: "raw-loader",
          },
        ],
      },
    ],
  },
};
