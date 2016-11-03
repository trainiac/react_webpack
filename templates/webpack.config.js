/* eslint-disable no-var, object-shorthand */

var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var buildPath = path.join(__dirname, 'build')
var srcPath = path.join(__dirname, 'src')

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    path.join(srcPath, 'index.js')
  ],
  output: {
    path: buildPath,
    filename: 'bundle.js',
    publicPath: '/static'
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: srcPath
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('css-loader')
    }]
  }
}
