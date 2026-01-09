// webpack/webpack.common.js
import DotenvPlugin from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export default {
  entry: './src/index.tsx',

  output: {
    path: path.resolve(rootDir, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    clean: true,
    publicPath: '/',
    assetModuleFilename: 'assets/[name].[hash:8][ext]',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(rootDir, 'src'),
      '@/app': path.resolve(rootDir, 'src/app'),
      '@/shared': path.resolve(rootDir, 'src/shared'),
    },
  },

  module: {
    rules: [
      // JS/TS - 공통
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { cacheDirectory: true },
        },
      },
      // 이미지 - 공통
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
      },
      // 폰트 - 공통
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new DotenvPlugin({
      systemvars: true,
    }),
  ],
};
