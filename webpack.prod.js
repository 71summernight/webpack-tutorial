// webpack.prod.js
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
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
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer']],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // console.log 제거
            pure_funcs: ['console.info', 'console.debug', 'console.warn'],
          },
          format: {
            comments: false, // 주석 제거
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // React 관련 vendor 분리
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: 'react-vendors',
          priority: 40,
        },
        // 기타 vendor
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 30,
        },
      },
    },
    runtimeChunk: 'single', // 런타임 분리 → 캐시 효율 상승
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 300000, // 300KB
    maxAssetSize: 200000, // 200KB
  },
});
