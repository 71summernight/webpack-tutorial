import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import DotenvPlugin from 'dotenv-webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    clean: true,
    publicPath: '/',
    assetModuleFilename: 'assets/[name].[hash:8][ext]',
  },
  devtool: isDevelopment ? 'cheap-module-source-map' : 'source-map',
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    compress: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: {
    minimize: !isDevelopment,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: !isDevelopment,
            pure_funcs: isDevelopment ? [] : ['console.log', 'console.debug'],
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
          name: 'common',
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react-vendors',
          priority: 15,
          reuseExistingChunk: true,
        },
        query: {
          test: /[\\/]node_modules[\\/](@tanstack[\\/]react-query)[\\/]/,
          name: 'query-vendors',
          priority: 14,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: !isDevelopment && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    !isDevelopment &&
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new DotenvPlugin(),
  ].filter(Boolean),
};
