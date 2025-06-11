const babel = require('@babel/core');
function loader(resourceCode, inputSourceMap, inputAst) {
  // 正在处理的文件的绝对路径
  const filename = this.resourcePath;
  const useOptions = this.getOptions();
  const options = {
    filename,
    inputSourceMap, // 指定代码的sourceMap
    sourceMap: true, // 表示是否要生成sourceMap
    sourceFileName: filename, // 知道编译后的文件所属的文件名
    ast: true, // 是否生成ast
    ...useOptions
  }
  const config = babel.loadPartialConfig(options);
  console.log('config:', config);
  if (config) {
    const result = babel.transformSync(resourceCode, config.options);
    console.log('result:', result);
    // code:转译后的代码; map:sourcemap映射文件; ast:抽象语法树
    this.callback(null, result.code, result.map, result.ast);
    return;
  }
  return resourceCode;
}
module.exports = loader;