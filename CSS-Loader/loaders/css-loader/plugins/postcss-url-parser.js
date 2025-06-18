const valueParser = require('postcss-value-parser');
const { stringifyRequest } = require('../utils');
const isUrlFunc = /url/i;
const needParseDeclaration = /(?:url)\(/i;

// 定义一个名为 parseDeclaration 的函数，用于解析给定的 PostCSS 声明节点
function parseDeclaration(declaration) {
  // 如果声明的值不包含需要解析的函数（例如 url()）则跳过解析
  if (!needParseDeclaration.test(declaration.value)) {
    return [];
  }
  // 使用 postcss-value-parser 解析声明的值, 得到一个节点树
  const parsed = valueParser(declaration.value);
  // 创建一个空数组parsedURLs，用于存储解析出的 URL 信息
  const parsedURLs = [];
  parsed.walk(valueNode => { 
    // 如果当前节点不是函数类型，跳过此节点
    if (!valueNode.type === 'function') {
      return;
    }
    // 如果当前函数名称是 url()函数, 继续处理
    if (isUrlFunc.test(valueNode.value)) {
      // 从当前节点中提取子节点数组
      const { nodes } = valueNode;
      // 将子节点数组转换回字符串，得到 url 的值
      let url = valueParser.stringify(nodes);
      // 将解析出来的 URL 信息做为对象添加到 parsedURLs 数组中
      parsedURLs.push({
        declaration, // 当前处理的声明节点
        node: valueNode.nodes[0], // //获取 url() 函数内部的节点（例如 'image.png'）
        url, // 解析出的 URL 字符串
        parsed, // 解析后的节点树
      })
    }
  });
  return parsedURLs;
}

const plugin = ({ imports, urlHandler, replacements }) => {
  return {
    // 插件的名字，用来解析url路径
    postcssPlugin: 'postcss-url-parser',
    // prepare逻辑会在开始解析CSS语法树之前触发
    prepare() {
      // 定义一个数组，用于存储解析好的url声明
      const parsedDeclaration = [];
      return {
        // 在postcss内部会进行语法树的遍历，当遍历到Declaration节点的时候，就会进入此函数进行处理
        Declaration(declaration) {
          // 通过 parseDeclaration 解析声明，获取解析后的值
          const parsedURLs = parseDeclaration(declaration);
          parsedDeclaration.push(...parsedURLs)
        },
        // 定义用于处理post处理结束时候的逻辑
        OnceExit() {
          // 如果CSS没有引入任何url，直接返回
          if (parsedDeclaration.length === 0) {
            return;
          }
          imports.push({
            type: 'get_url_import',
            importName: 'cssLoaderGetUrlImport',
            url: urlHandler(require.resolve('../runtime/getUrl'))
          })
          for (let i = 0; i < parsedDeclaration.length; i++) {
            const item = parsedDeclaration[i];
            const { url, node } = item;
            const importName = `cssLoaderUrlImport${i}`;
            imports.push({
              type: 'url', // 没什么用，只用来标识导入模块的类型
              importName: importName,
              url: url,
            })
            const replacementName = `cssLoaderUrlReplacement${i}`;
            replacements.push({
              importName, // 替换前的名称（导入的url对应的模块名）
              replacementName, // 替换后的名称（通过getUrl处理之后的名称）
            })
            console.log('node', node);
            // 把节点的值改为替换后的变量名 url('./images/css-loader&style-loader.png') => url('cssLoaderUrlReplacement0')
            node.value = replacementName;
            // 修改语法树
            item.declaration.value = item.parsed.toString();
          }
        }
      }
    }
  }
}

// 表示这是一个postcss插件
plugin.postcss = true;

module.exports = plugin;

