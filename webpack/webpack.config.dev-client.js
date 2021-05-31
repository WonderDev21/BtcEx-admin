const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = process.env.NODE_ENV;
const commonLoaders = [
  {
    test: /\.js$|\.jsx$/,
    loaders: ['babel-loader'],
    exclude: /node_modules/,
  },
  {
    test: /\.scss/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader!sass-loader',
    }),
  },
  {
    test: /\.css/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader',
    }),
  },
  {
    test: /\.(jpe?g|png|gif|svg)$/i,
    loader: 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
  },
];

module.exports = {
  name: 'browser',
  entry: {
    app: [path.resolve(__dirname, '../client/index.js')],
  },
  devtool: 'source-map',
  target: 'web',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    loaders: commonLoaders,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  plugins: [
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      'process.env.NODE_ENV': JSON.stringify(env || 'development'),
    }),
    new webpack.DefinePlugin({ 'process.env.BROWSER': true }),
    new ExtractTextPlugin('style.css'),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
