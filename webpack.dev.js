// webpack/webpack.dev.js
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'development',

  devtool: 'cheap-module-source-map',

  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    compress: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  },

  module: {
    rules: [
      // CSS - 개발용 (style-loader로 HMR 지원)
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },

  plugins: [new ReactRefreshWebpackPlugin()],
});
