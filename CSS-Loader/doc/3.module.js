const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');
const crypto = require('crypto');

const inputCSS = `
  :local(.background) {
    background-color: green;
  }
`

function generateScopedName(name) {
  const hash = crypto.createHash('md4').update(name).digest('hex');
  return `${name}_${hash}`
}

const plugin = () => {
  return {
    postcssPlugin: 'postcss-local-modules',
    Once(root, { rule }) {
      const exports = Object.create(null);
      function exportScopeName(name) {
        const scopedName = generateScopedName(name);
        exports[name] = scopedName;
        return scopedName;
      }
      function localizeNode(node) {
        switch(node.type) {
          case 'selector':
            node.nodes = node.map(localizeNode)
            return node;
          case 'class':
            // 生成一个新的类名选择器
            return selectorParser.className({
              value: exportScopeName(node.value)
            })
        }
      }
      // 遍历ast节点树
      function traverseNode(node) {
        switch(node.type) {
          case 'root':
          case 'selector':
            node.each(traverseNode);
            break;
          // 伪类节点
          case 'pseudo':
            if (node.value === ':local') {
              const localSelector = localizeNode(node.first);
              // 替换为新的类名选择器
              node.replaceWith(localSelector);
            }
            break;
        }
        return node;
      }
      // 遍历根节点下的所有的规则进行处理
      root.walkRules(rule => {
        const parsedSelector = selectorParser().astSync(rule);
        rule.selector = traverseNode(parsedSelector.clone()).toString();
      })
      const exportsNames = Object.keys(exports);
      if (exportsNames.length > 0) {
        const exportRule = rule({
          selector: ':exports'
        })
        exportsNames.forEach(exportedName => {
          exportRule.append({
            prop: exportedName,
            value: exports[exportedName],
            raw: { before: '\n' }
          })
        })
        root.append(exportRule);
      }
    }
  }
}

plugin.postcss = true;

const res = postcss([plugin()]).process(inputCSS);
console.log(res.css);

