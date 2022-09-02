const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  // devServer: {
  //   static: {
  //     directory: path.join(__dirname, 'public'),
  //   },
  // },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};
