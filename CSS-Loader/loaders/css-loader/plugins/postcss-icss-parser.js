const icssUtils = require('icss-utils');
function plugin({ exports }) {
  return {
    postcssPlugin: 'postcss-icss-parser',
    OnceExit(root) {
      const { icssExports } = icssUtils.extractICSS(root);
      for (const name of Object.keys(icssExports)) {
        const value = icssExports[name];
        exports.push({ name, value });
      }
    }
  }
}

plugin.postcss = true;
module.exports = plugin;
// 提取 postcss-modules-scope 插件中写入的 :export 伪类规则