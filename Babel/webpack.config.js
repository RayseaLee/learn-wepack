
const path = require('path');
module.exports = {
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              'plugins': [
                [
                  path.resolve(__dirname, './plugins/babel-plugins-import.js'),
                  // 'import',
                  {
                    'libraryDirectory': '', // import _ from 'lodash/lib' libraryDirectory: lib 库名后的文件名
                    'libraryName': 'lodash' // import _ from 'lodash' libraryName: lodash 库名
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  }
}