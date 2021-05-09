import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default {
  mode: process.env.NODE_ENV || 'development',

  entry: path.resolve(dirname, './src/index.js'),

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],

  devServer: {
    port: 9000,
    overlay: true,
    disableHostCheck: true,
    transportMode: 'ws',
    watchContentBase: true,
  },
};
