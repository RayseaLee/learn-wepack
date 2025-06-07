const { transformSync } = require('@babel/core');
const tscPlugin = require('./tscPlugin');

const sourceCode = `
var a:number = 'abc'
`

const { code } = transformSync(sourceCode, {
  parserOpts: {
    plugins: [ 'typescript' ]
  },
  filename: './some.js',
  plugins: [
    tscPlugin()
  ]
})

console.log(code);
