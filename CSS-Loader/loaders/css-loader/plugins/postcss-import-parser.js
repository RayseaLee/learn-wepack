const valueParser = require('postcss-value-parser');
const { stringifyRequest } = require('../utils');
const loader = require('..');

function parseNode(atRule) { 
  const params = atRule.params; // "basic.css"
  const valueNode = valueParser(params);
  const url = valueNode.nodes[0].value;
  return {
    atRule,
    url
  }
}

const plugin = ({ imports, loaderContext, urlHandler, api }) => {
  return {
    // 插件的名字，用来解析url路径
    postcssPlugin: 'postcss-import-parser',
    // prepare逻辑会在开始解析CSS语法树之前触发
    prepare() {
      // 存储解析到的@import规则
      const parsedAtRules = [];
      return {
        AtRule: {
          import(atRule) {// 捕获@import
            let parsedAtRule = parseNode(atRule);
            parsedAtRules.push(parsedAtRule);
          }
        },
        async OnceExit() {
          if (parsedAtRules.length === 0) {
            return;
          }
          // 用于解析路径的解析器
          // 因为查找loader的方式和查找普通模块的方法是不一样的
          const resolver = loaderContext.getResolve();
          for (let i = 0; i < parsedAtRules.length; i++) {
            const { atRule, url } = parsedAtRules[i];
            // 语法转换后其实这个@import语法就消失了，删除原始的@import规则
            atRule.remove();
            // loaderContext.context模块所在的目录 resolvedUrl绝对路径
            const resolvedUrl = await resolver(loaderContext.context, './' + url)
            let importName = `cssLoaderAtRuleImport${i}`;
            imports.push({
              type: 'css-import',
              importName,
              url: urlHandler(resolvedUrl),
            })
            api.push({
              importName
            })
          }
        }
      }
    }
  }
}

// 表示这是一个postcss插件
plugin.postcss = true;

module.exports = plugin;

