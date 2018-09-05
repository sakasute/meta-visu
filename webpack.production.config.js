const path = require('path');

module.exports = {
  entry: ['@babel/polyfill', './src/lib/polyfills.js', 'whatwg-fetch', './src/index.js'],
  mode: 'production',
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
