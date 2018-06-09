const path = require('path');
const WebpackBar = require('webpackbar');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const MODE = process.env.NODE_ENV;

const isProduction = () => {
  return MODE === 'production';
}

module.exports = {
  mode: MODE,
  entry: {
    drift: './js/drift.js',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new WebpackBar(),
    isProduction ? new UglifyJsPlugin() : null,
  ],
  devtool: 'inline-source-map',
}