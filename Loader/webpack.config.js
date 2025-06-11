const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  // 都是用来指定如何查找模块路径
  // 找模块的
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 专门用来找loader的
  resolveLoader: {
    // 配置别名
    alias: {
      'babel-loader': path.resolve('loaders', 'babel-loader.js')
    },
    // 去哪个目录找loaders
    modules: [
      'node_modules',
      path.resolve('loaders')
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      tempale: './src/index.html'
    })
  ]
}