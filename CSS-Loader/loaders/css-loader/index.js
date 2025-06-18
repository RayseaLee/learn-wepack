const { getImportCode, stringifyRequest, getModuleCode, getExportCode } = require('./utils');
const postcss = require('postcss');
const urlParser = require('./plugins/postcss-url-parser');
/**
 * css-loader
 * @param {*} content css代码
 */
function loader(content) {
  const callback = this.async();
  const options = this.getOptions();
  const plugins = [];
  const replacements = [];
  // 定义要导出的模块及别名
  const urlPluginImports = [];
  if (options.url) {
    plugins.push(urlParser({
      imports: urlPluginImports,
      urlHandler: (url) => stringifyRequest(this, url),
      replacements
    }))
  }
  postcss(plugins)
    .process(content, { from: this.resourcePath, to: this.resourcePath })
    .then((result) => {
      console.log('result.css', result.css);
      const imports = [
        {
          importName: 'cssLoaderApiNoSourcemapImport',
          url: stringifyRequest(this, require.resolve('./runtime/noSourceMaps.js'))
        }, 
        {
          importName: 'cssLoaderApiImport',
          url: stringifyRequest(this, require.resolve('./runtime/api.js'))
        }
      ];
      imports.push(...urlPluginImports);
      const importCode = getImportCode(imports);
      const moduleCode = getModuleCode(result, replacements);
      const exportCode = getExportCode(options);
      callback(null, `${importCode}${moduleCode}${exportCode}`);
    })
}

module.exports = loader;