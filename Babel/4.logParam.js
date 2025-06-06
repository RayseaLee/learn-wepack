// 向console打印的内容前面添加 相对路径名 行 列

const { transformSync } = require('@babel/core');
const types = require('@babel/types');
const path = require('path');

const sourceCode = `
  console.log('hello world');
`;

const visitor = {
  CallExpression(pathNode, state) {
    const { node } = pathNode;
    if (types.isMemberExpression(node.callee)) {
      if (node.callee.object.name === 'console') {
        if (['log', 'warn', 'error', 'info', 'debug'].includes(node.callee.property.name)) {
          const { line, column } = node.loc.start; // 行、列
          const relativeFileName = path.relative(__dirname, state.file.opts.filename).replace(/\\/g, '/') // 文件相对路径
          node.arguments.unshift(
            types.stringLiteral(
              `${relativeFileName} ${line} ${column}` // 相对路径 行 列
            )
          )
        }
      }
    }
  }
}
function logParamPlugin() {
  return {
    visitor
  }
}

const { code } = transformSync(sourceCode, {
  filename: 'some.js',
  plugins: [logParamPlugin()]
});

console.log(code);