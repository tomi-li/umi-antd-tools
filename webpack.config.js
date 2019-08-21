const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

config.devtool = 'source-map';
config.entry = './src/index.js';
config.output = {
  path: path.resolve('dist'),
  filename: 'bundle.js',
  libraryTarget: 'umd'
};

module.exports = {
  target: 'node',
  mode: process.env.NODE_ENV,
  externals: [
    'react',
    'react-dom',
    'moment'
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCSSAssetsPlugin({
        canPrint: false
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:2]'
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(sc|c)ss$/,
        include: /node_modules|libs|examples/,
        exclude: /all\.scss/,
        loaders: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.(png|jpg|gif|webp)$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(ttf|eot|woff|woff2)(\?.+)?$/,
        loader: 'file-loader?name=[hash:12].[ext]'
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.md$/,
        loader: 'raw-loader'
      }
    ]
  },
};