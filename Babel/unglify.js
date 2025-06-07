const {transformSync} = require('@babel/core');
const types = require('@babel/types');
const ungifyPlugin = require('./ungifyPlugin');

const sourceCode = `
var abc = 1;
console.log(abc);
var Lee = 2;
`

const { code } = transformSync(sourceCode, {
  filename: './some.js',
  plugins: [
    ungifyPlugin()
  ]
})

console.log(code);
