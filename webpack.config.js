const path = require('path');
const WebpackBar = require('webpackbar');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const MODE = process.env.NODE_ENV;

const isProduction = () => MODE === 'production';

const config = {
  mode: MODE,
  entry: {
    drift: './js/drift.js',
    algolia: './js/algolia.js',
    prism: './js/prism.js',
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
}
config.devtool = isProduction() ? undefined : 'inline-source-map';
module.exports = config;