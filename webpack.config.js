import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: process.env.NODE_ENV || 'development',

  entry: path.resolve(__dirname, './src/index.js'),

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
