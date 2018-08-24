const path = require('path');

module.exports = {
  entry: ['babel-polyfill', 'promise-polyfill', 'whatwg-fetch', 'es5-shim', './src/index.js'],
  output: {
    filename: 'index_bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
