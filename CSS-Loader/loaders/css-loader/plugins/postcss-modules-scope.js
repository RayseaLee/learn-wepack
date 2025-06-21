const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');
const crypto = require('crypto');

function generateScopedName(name, loaderContext) {
  const hash = crypto.createHash('md4').update(loaderContext.resourcePath).digest('hex');
  return `_${hash}__${name}`
}

function plugin({ loaderContext }) {
  return {
    postcssPlugin: 'postcss-local-modules',
    Once(root, { rule }) {
      // 存储新老类名映射关系
      const exports = Object.create(null);

      function exportScopeName(name) {
        // 新类名
        const scopedName = generateScopedName(name, loaderContext);
        // 新老类名映射
        exports[name] = scopedName;
        return scopedName;
      }

      function localizeNode(node) {
        switch(node.type) {
          case 'selector':
            // 递归处理nodes子节点
            node.nodes = node.map(localizeNode);
            // 返回处理后的节点
            return node;
          case 'class':
            // 子节点，返回新的类名节点
            return selectorParser.className({
              value: exportScopeName(node.value)
            })
        }
      }

      function traverseNode(node) {
        if (node.type === 'root' || node.type === 'selector') {
          // 递归遍历根节点
          node.each(traverseNode);
        } else if (node.type === 'pseudo' && node.value === ':local') {
          // 找到 :local 伪类结点
          // 生成新的类名选择器
          const localSelector = localizeNode(node.first);
          // 替换为新的类名选择器
          node.replaceWith(localSelector);
        }
        return node;
      }

      // 遍历根节点上所有的规则节点
      root.walkRules(rule => {
        // 将规则的选择器转为语法树
        const parsedSelector = selectorParser().astSync(rule);
        // 用新的类名选择器替换旧的类名选择器
        rule.selector = traverseNode(parsedSelector.clone()).toString();
      })

      const exportNames = Object.keys(exports);
      if (exportNames.length > 0) {
        // rule工厂函数生成新的伪类规则:export
        const exportRule = rule({
          selector: ':export'
        });
        // 遍历所有的老类名
        exportNames.forEach(exportName => {
          // 将所有的类名添加到 :export 伪类规则中
          // :export{
          //   className: newClassName
          // }
          exportRule.append({
            prop: exportName,
            value: exports[exportName],
            raw: { before: '\n' }
          })
        });
        // 将新的伪类规则添加到根节点中
        root.append(exportRule);
      }
    }
  }
}

plugin.postcss = true;
module.exports = plugin;