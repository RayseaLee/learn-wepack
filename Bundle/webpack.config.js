const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = { 
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {},
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      fileName: 'index.html'
    })
  ]
};