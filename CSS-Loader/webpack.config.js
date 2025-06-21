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
            // loader: 'style-loader',
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
              importLoaders: 0,
              modules: {
                mode: 'local',
                // 指的是导出的是一个数组，数组有一个locals属性, 为true时不能配合style-loader一起使用
                exportOnlyLocals: false
              }
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