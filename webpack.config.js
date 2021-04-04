import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import cwp from 'clean-webpack-plugin';
import wmp from 'webpack-manifest-plugin';
const { CleanWebpackPlugin } = cwp;
const { WebpackManifestPlugin } = wmp;
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev  = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

export default {
  mode: process.env.NODE_ENV || 'development',

  target: isDev ? 'web' : 'browserslist',

  context: path.resolve(__dirname, './src'),

  entry: {
    index: path.resolve(__dirname, './src/js/index.js')
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].[contenthash].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-syntax-dynamic-import']
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              url: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
                sourceMap: isDev
            }
          },
          {
            loader: 'sass-loader',
            options: {
                sourceMap: isDev
            }
          }
        ]
      },
    ],
  },

  devtool: isDev && 'eval-cheap-module-source-map',

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      inject: 'body'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    new WebpackManifestPlugin(
      {
        publicPath: '/'
      }
    )
  ],

  resolve: {
    alias: {
        '@': path.resolve(__dirname, './src')
    }
  },

  devServer: {
    port: 9000,
    overlay: true,
    disableHostCheck: true,
    publicPath: '/',
    contentBase: './src',
    writeToDisk: true,
    transportMode: 'ws',
    watchContentBase: true
  }
};