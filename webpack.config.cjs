const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

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
      extensions: ['.ts', '.js', '.css', '.html']
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
          use: [MiniCssExtractPlugin.loader, 'css-loader']
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
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css"
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "./assets", to: "./assets" },
          { from: "./favicon.ico", to: "./favicon.ico" }
        ]
      })
    ],
    devtool: mode === "development" ? "source-map" : undefined
  }

  if (mode === "production") {
    config.plugins.push(new CssMinimizerPlugin());
  }

  return config;
}