const path = require('path');

module.exports = {
  entry: ['./src/index.js'],
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    filename: 'index_bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
