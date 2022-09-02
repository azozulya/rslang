const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const baseConfig = {
  entry: [
    path.resolve(__dirname, './src/assets/scss/base/normalize.scss'),
    path.resolve(__dirname, './src/index.ts'),
    path.resolve(__dirname, './src/assets/scss/index.scss'),
  ],
  module: {
    rules: [
      // {
      //   test: /\.css$/i,
      //   use: ['style-loader', 'css-loader'],
      // },
      // {
      //   test: /\.scss$/,
      //   use: ['style-loader', 'css-loader', 'sass-loader'],
      // },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(mp3|wav)$/,
        loader: 'file-loader',
        options: {
          name: 'audio/[path][name].[ext]',
        },
      },
      {
        test: /\.ts(x)?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // {
      //   test: /\.(woff(2)?|ttf|eot)$/i,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: 'assets/fonts/[name][ext]',
      //   },
      // },
      // {
      //   test: /\.tsx$/,
      //   use: 'babel-loader',
      // },
      // {
      //   test: /\.(json)$/i,
      //   type: 'asset/resource',
      // },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[hash].bundle.js',
    path: path.resolve(__dirname, './dist'),
    assetModuleFilename: 'img/[hash][ext]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: './src/assets/img',
    //       to: './assets/img',
    //     },
    //     {
    //       from: './src/assets/audio/',
    //       to: './assets/audio',
    //     },
    //   ],
    // }),
    new CleanWebpackPlugin(),
  ],
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode
    ? require('./webpack.prod.config')
    : require('./webpack.dev.config');

  return merge(baseConfig, envConfig);
};
