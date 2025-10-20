// webpack.common.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { DefinePlugin } = require('webpack');

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // 파일명은 dev/prod에서 덮어씀
    chunkFilename: '[name].chunk.js',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      // JS/TS
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              ['@babel/preset-env', { modules: false, bugfixes: true, useBuiltIns: 'usage', corejs: '3' }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      // 이미지 / 폰트
      { test: /\.(png|jpe?g|gif|svg)$/i, type: 'asset/resource' },
      { test: /\.(eot|ttf|woff2?)$/i, type: 'asset/resource' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body',
    }),
    new Dotenv({ path: `./.env.${process.env.NODE_ENV || 'development'}` }),
    new DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:3000'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.APP_PHASE': JSON.stringify(process.env.APP_PHASE || 'local'),
    }),
  ],
};
