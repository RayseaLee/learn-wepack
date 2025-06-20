const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: path.resolve('./loaders/style-loader')
          },
          {
            // loader: 'css-loader',
            loader: path.resolve('./loaders/css-loader'),
            options: {
              esModule: false,
              url: true,
              import: true,
              // 在处理包含（import）的css之前要执行几个前置loader
              importLoaders: 0
            }
          },
          path.resolve(__dirname, './loaders/logger-loader')
        ]
      },
      {
        test: /\.png$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}