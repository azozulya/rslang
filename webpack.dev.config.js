const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(mp3|wav)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/audio/[name].[ext]',
        },
      },
    ],
  },
};
