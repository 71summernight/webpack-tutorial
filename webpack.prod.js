// webpack.prod.js
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common');

/** @type {import('webpack').Configuration} */
module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
  },
  module: {
    rules: [
      // CSS: 운영은 파일로 추출
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })],
  devtool: 'source-map',
  optimization: {
    splitChunks: { chunks: 'all' },
    runtimeChunk: 'single', // 런타임 분리 → 캐시 효율 상승
  },
  performance: {
    hints: false, // 경고가 거슬리면 끄기(선택)
  },
});
