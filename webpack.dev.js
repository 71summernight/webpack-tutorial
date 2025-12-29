// webpack.dev.js
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');
const common = require('./webpack.common');

/** @type {import('webpack').Configuration} */
module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [
      // CSS: 개발은 style-loader
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Babel에 react-refresh 플러그인 추가 (loader 옵션 merge)
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { plugins: [require.resolve('react-refresh/babel')] },
        },
      },
    ],
  },
  plugins: [new ReactRefreshWebpackPlugin()],
  devtool: 'cheap-module-source-map',
  devServer: {
    static: { directory: path.join(__dirname, 'public') },
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: false,
    compress: true,
    // host: '0.0.0.0', allowedHosts: 'all', // 필요 시 외부 접근 허용
  },
  optimization: {
    splitChunks: { chunks: 'all' },
    // runtimeChunk: 'single' // 개발에선 없어도 무방
  },
});
