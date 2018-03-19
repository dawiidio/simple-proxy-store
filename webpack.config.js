const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: path.join(__dirname, 'src', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    library: 'simple-proxy-store',
    libraryTarget:'umd'
  },
  module: {
    rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          "presets": [
            [
              "env",
              {
                "targets": { "uglify": true },
                "useBuiltIns": true
              }
            ]
          ],
          plugins: ["add-module-exports", "transform-es2015-modules-umd", "transform-object-rest-spread"]
        }
      }
    }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['lib'])
  ]
};

module.exports = config;
