const path = require('path');
const fs = require('fs');
const types = require('babel-types'); // 生成和判断节点的工具库
const parser = require('@babel/parser'); // 把源代码转换成AST的编译器
const traverse = require('@babel/traverse').default; // 遍历语法树的工具
const generator = require('@babel/generator').default; // 把转换后的语法树重新生成源代码的工具
// 把路径中的\转成/
function toUnixSeq(filePath) {
  return filePath.replace(/\\/g, '/');
}
class Complication {
  constructor(options) {
    this.options = options;
    this.options.context = this.options.context || toUnixSeq(process.cwd()); // current working directory
    this.fileDependencies = new Set();
    this.modules = []; // 本次编译所有的模块
    this.chunks = []; // 存放所有的代码块
    this.assets = {}; // 存放输出的文件 key: 文件名, value: 文件内容
  }
  build(onCompiled) {
    // webpackFlow: 5.根据配置中的entry找出入口文件
    let entry = {};
    if (typeof this.options.entry === 'string') {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }
    for (let entryName in entry) {
      // 获取入口文件的绝对路径
      const entryFilePath = path.posix.join(this.options.context, entry[entryName]);
      // 把此文件添加到文件依赖列表中
      this.fileDependencies.add(entryFilePath);
      // 从入口文件出发，开始编译模块
      let entryModule = this.buildModule(entryName, entryFilePath);
      // webpackFlow: 8.根据入口和模块之间的依赖关系，组装成一个个包含多个模块的chunk
      let chunk = {
        name: entryName, // 入口名称
        entryModule, // 入口模块
        modules: this.modules.filter(module => module.names.includes(entryName)) // 此入口依赖的模块
      };
      this.chunks.push(chunk);
    }
    // webpackFlow: 9.再把每个 Chunk 转换成一个单独的文件加入到输出列表
    this.chunks.forEach(chunk => {
      let outputFileName = this.options.output.filename.replace('[name]', chunk.name)
      this.assets[outputFileName] = getSouceCode(chunk);
    })
    // 最后执行编译完成回调
    onCompiled(
      null,
      {
        modules: this.modules,
        chunks: this.chunks,
        assets: this.assets
      },
      this.fileDependencies
    )
    console.log('this.modules',this.modules);
  }
  buildModule(entryName, modulePath) {
    // webpackFlow: 6.从入口文件出发，调用所有配置的loader对模块进行转换
    const rawSourceCode = fs.readFileSync(modulePath, 'utf-8');
    // 获取loader的配置规则
    let { rules } = this.options.module;
    const loaders = [];
    // 匹配对应文件的loader
    rules.forEach(rule => {
      // 用模块路径匹配正则表达式
      if (modulePath.match(rule.test)) {
        loaders.push(...rule.use);
      }
    })
    const transformedSourceCode = loaders.reduceRight((sourceCode, loader) => {
      return require(loader)(sourceCode)
    }, rawSourceCode)
    // 获取当前模块的id, 也就是 ./src/entry1.js的模块id
    const moduleId = './' + path.posix.relative(this.options.context, modulePath);
    const module = { id: moduleId, names: [entryName], dependencies: new Set()};
    this.modules.push(module);
    // webpackFlow: 7.再找出该模块依赖的模块, 再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
    let ast = parser.parse(transformedSourceCode, { sourceType: 'module' });
    traverse(ast, {
      CallExpression: ({ node }) => { 
        // 如果调用的方法名是require, 说明要依赖一个其他模块
        if (node.callee.name === 'require') {
          // ./title  .代表当前的模块所在的目录, 不是工作目录
          const depModuleName = node.arguments[0].value;
          // D:/code/learn/webpack/Flow/src
          const dirName = path.posix.dirname(modulePath);
          // D:/code/learn/webpack/Flow/src/title
          let depModulePath = path.posix.join(dirName, depModuleName);
          const { extensions } = this.options.resolve;
          // 添加扩展名 D:/code/learn/webpack/Flow/src/title.js
          depModulePath = tryExtensions(depModulePath, extensions);
          // 把依赖的模块路径添加到文件依赖列表
          this.fileDependencies.add(depModulePath);
          // 获取此模块的ID, 也就是相当于根目录的相对路径
          let depModuleId = './' + path.posix.relative(this.options.context, depModulePath);
          // 修改语法树, 把引入模块路径改为模块的id
          node.arguments[0] = types.stringLiteral(depModuleId);
          // 给当前的entry1模块添加依赖信息
          module.dependencies.add({
            depModuleId,
            depModulePath
          })
        }
      }
    });
    const { code } = generator(ast);
    // 把转换后的源码放在_source上,用于后面写入文件
    module._source = code;
    // 递归处理深层依赖
    [...module.dependencies].forEach(({depModuleId, depModulePath}) => {
      // 判断模块是否已经编译过
      let existModule = this.modules.find(item => item.id === depModuleId);
      if (existModule) {
        // 只需要把新的入口名称添加到模块的names数组就可以
        existModule.names.push(entryName)
      } else {
        this.buildModule(entryName, depModulePath);
      }
    })
    return module;
  }
}

function getSouceCode(chunk) {
  return `
    (() => {
      var __webpack_modules__ = {
        ${
          chunk.modules
          .filter(module => module.id !== chunk.entryModule.id)
          .map(module => 
            `"${module.id}": module => {
              ${module._source}
            }`
          )
        }
      };
      var __webpack_module_cache__ = {};
      function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
          return cachedModule.exports;
        }
        var module = (__webpack_module_cache__[moduleId] = {
          exports: {},
        });
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
      }
      (() => {
        ${chunk.entryModule._source}
      })();
    })();
  `
}

// 添加文件后缀名
function tryExtensions(modulePath, extensions) {
  // 如果此绝对路径上的文件存在,直接返回
  if (fs.existsSync(modulePath)) {
    return modulePath;
  }
  for (let i = 0; i < extensions.length; i++) {
    const filePath = modulePath + extensions[i];
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  throw new Error(`${modulePath} not found`);
}

module.exports = Complication;