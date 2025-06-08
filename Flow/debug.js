const webpack = require('./webpack.js');
const fs = require('fs');
const path = require('path');
const config = require('./webpack.config.js');
const compiler = webpack(config);
compiler.run((err, stats) => {
  console.log(err);
  let statsString = JSON.stringify(
    stats.toJson({
      modules: true, // 每个文件都是一个模块
      chunks: true, // 打印所有的代码块，模块的集合会合成一个代码块
      assets: true, // 输出的文件列表
    })
  )
  console.log(statsString);
  fs.writeFileSync(path.resolve(__dirname, 'myStats.json'), statsString);
});