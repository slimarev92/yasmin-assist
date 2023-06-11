const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (_, argv) => {
  const mode = argv.mode;

  const config = {
    entry: {
      "main": {
        import: "./main.ts",
        filename: "[name].[contenthash].js"
      },
      "google-custom": {
        import: "./google-custom.ts",
        filename: "[name].[contenthash].js"
      }
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.ts', '.js', '.css', '.html', '.xlsx']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css?$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.xlsx?$/,
          type: 'asset/resource'
        }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./index.html",
        chunks: ["main"],
      }),
      new HtmlWebpackPlugin({
        filename: "google-custom.html",
        template: "./google-custom.html",
        chunks: ["google-custom"],
      })
    ],
    devtool: mode === "development" ? "source-map" : undefined
  }

  return config;
}