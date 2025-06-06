// 向console打印的内容前面添加 相对路径名 行 列

const autoLoggerPlugin = require('./autoLoggerPlugin');
const { transformSync } = require('@babel/core');
const path = require('path');

const sourceCode = `
  function sum(a,b){
      return a+b;
  }
  const multiply = function(a,b){
      return a*b;
  }
  const minis = (a,b)=>a-b;
  class Math{
      divide(a,b){
          return a/b;
      }
  }
`;

const { code } = transformSync(sourceCode, {
  filename: path.resolve(__dirname, './some.js'),
  plugins: [autoLoggerPlugin({
    libName: path.resolve(__dirname, './logger.js'), // 把获取业务数据的逻辑写在logger里
    params: ['a', 'b'],
    funNames: ['sum', 'multiply', 'minis', 'divide']
  })]
});

console.log(code);
