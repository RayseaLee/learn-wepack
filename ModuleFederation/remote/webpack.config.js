const path = require("path");
const webpack = require("webpack");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    // 当我们把生成后的bundle.js文件写入html的时候，需要添加的前缀
    publicPath: "http://localhost:3000/",
    // false不使用异步加载
    chunkLoading: 'jsonp',
    clean: true
  },
  devServer: {
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-react',
                  {// 如果想手动引入react 用classic（默认），不想的话用automatic
                    "runtime": 'classic'
                  }
                ]
              ]
            }
          }
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new ModuleFederationPlugin({
      filename: 'remoteEntry.js', // 远程的文件名
      name: 'remote', // 远程的名称
      exposes: { // 要向外暴露的组件
        './NewsList': './src/NewsList', // remote/NewsList
        './click': './src/click'
      },
      // 指定远程的名称和访问路径
      remotes: {
        host: 'host@http://localhost:8000/remoteEntry.js'
      },
      // shared: {
      //   react: { singleton: true, requiredVersion: '19.1.0' },
      //   'react-dom': { singleton: true, requiredVersion: '19.1.0' },
      // }
    })
  ]
};
