const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: "production",
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
  ]
};
