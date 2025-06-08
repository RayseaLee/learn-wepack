
const path = require('path');
const RunPlugin = require('./plugins/RunPlugin');
const Donelugin = require('./plugins/DonePlugin');

module.exports = {
  devtool: false,
  entry: {
    entry1: './src/entry1.js',
    entry2: './src/entry2.js'
  },
  output: {
    path: path.resolve("dist"),
    filename: "[name].js",
    clean: true,
  },
  mode: 'development',
  // 配置查找模块的路径规则
  resolve: {
    // 当引入模块的时候可以不写扩展名,按顺序匹配
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, './loaders/logger1-loader.js'),
          path.resolve(__dirname, './loaders/logger2-loader.js')
        ]
      }
    ]
  },
  plugins: [
    new RunPlugin(),
    new Donelugin()
  ]
}