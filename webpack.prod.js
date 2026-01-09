import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import DotenvPlugin from 'dotenv-webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

const useAnalyzer = process.env.USE_ANALYZER === 'true';

export default merge(common, {
  mode: 'production',

  devtool: 'source-map',

  output: {
    // common의 output을 덮어쓰지 않고 추가/수정할 부분만
  },

  module: {
    rules: [
      // CSS - 프로덕션용 (별도 파일 추출)
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            passes: 3,
          },
          format: {
            comments: false,
          },
          mangle: true,
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react-vendors',
          priority: 15,
        },
        query: {
          test: /[\\/]node_modules[\\/](@tanstack[\\/]react-query)[\\/]/,
          name: 'query-vendors',
          priority: 14,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
      },
    },
    runtimeChunk: { name: 'runtime' },
  },

  plugins: [
    new DotenvPlugin({
      path: '.env.production',
      systemvars: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }),
    ...(useAnalyzer
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'bundle-report.html',
            openAnalyzer: false,
          }),
        ]
      : []),
  ],

  performance: {
    hints: 'warning',
    maxEntrypointSize: 300000,
    maxAssetSize: 200000,
  },
});
