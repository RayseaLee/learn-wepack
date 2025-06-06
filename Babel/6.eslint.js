const {transformSync} = require('@babel/core');
const types = require('@babel/types');
const path = require('path');
const noConsolePlugin = require('./noConsolePlugin');

const sourceCode = `
var a = 1;
console.log(a);
var b = 2;
`

const { code } = transformSync(sourceCode, {
  filename: './some.js',
  plugins: [
    noConsolePlugin({
      fix: true
    })
  ]
})

console.log(code);
