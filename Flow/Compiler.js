// 引入tapable库中的SyncHook类，用于创建同步钩子
const { SyncHook } = require('tapable');
// 引入path模块，用于处理文件和目录路径
const path = require('path');
// 引入fs模块，用于操作文件系统
const fs = require('fs');
const Complication = require('./Complication');
// 定义Compiler类
class Compiler {
  // 构造函数，接收一个options参数
  constructor(options) {
    this.options = options;
    // 初始化钩子对象，保护run和done两个同步钩子
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook(),
    };
  }
  // run方法，接收一个回调函数callback
  run(callback) {
    this.hooks.run.call();
    const onCompiled = (err, stats, fileDependencies) => {
      // webpackFlow: 10.在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
      const { assets } = stats;
      for (let filename in assets) {
        const filePath = path.posix.join(this.options.output.path, filename);
        fs.writeFileSync(filePath, assets[filename], 'utf-8')
      }
      callback(err, {
        toJson: () => stats
      });
      // fileDependencies 指的是本次打包涉及哪些文件
      // 监听这些文件的变化，当文件发生变化，重新开启一个新的编译
      [...fileDependencies].forEach(file => {
        fs.watch(file, () => this.compile(onCompiled))
      });
    };
    // 开始一次新的编译
    this.compile(onCompiled)
    this.hooks.done.call();
  }

  compile(onCompiled) {
    const compilcation = new Complication(this.options);
    compilcation.build(onCompiled);
  }
}

// 导出Compiler类
module.exports = Compiler;
