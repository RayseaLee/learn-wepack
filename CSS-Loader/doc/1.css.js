const valueParser = require('postcss-value-parser');
const cssText = `background-image: url('../loaders/css-loader&style-loader.png');`
const parsedValue = valueParser(cssText);

parsedValue.walk((node) => {
  // console.log(node);
  if (node.type == 'function') {
    // console.log(node.value);
    // console.log(node.nodes);
    node.nodes[0].value = '新的图片路径'
  }
})

const serializedValue = valueParser.stringify(parsedValue);
console.log(serializedValue);  // background-image: url('新的图片路径');
