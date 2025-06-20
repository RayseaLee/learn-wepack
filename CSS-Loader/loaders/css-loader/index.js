const { getImportCode, stringifyRequest, getModuleCode, getExportCode, combineLoaders, getPreRequester } = require('./utils');
const postcss = require('postcss');
const urlParser = require('./plugins/postcss-url-parser');
const importParser = require('./plugins/postcss-import-parser');
/**
 * css-loader
 * @param {*} content css代码
 */
function loader(content) {
  const callback = this.async();
  const options = this.getOptions();
  const plugins = [];
  const replacements = [];
  // 定义通过url要导入的模块及别名
  const urlPluginImports = [];
  // 定义通过import导入引入的模块
  const importPluginImports = [];
  // 存放将来要调用i方法的模块
  const importPluginApi = [];
  if (options.import) {
    plugins.push(importParser({
      imports: importPluginImports,
      loaderContext: this,
      urlHandler: (url) => stringifyRequest(this,
        combineLoaders(
          getPreRequester(this, options),
          url
        )
      ),
      api: importPluginApi
    }))
  }
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
      imports.push(...importPluginImports, ...urlPluginImports);
      const importCode = getImportCode(imports);
      const moduleCode = getModuleCode(result, importPluginApi, replacements);
      const exportCode = getExportCode(options);
      callback(null, `${importCode}${moduleCode}${exportCode}`);
    })
}

module.exports = loader;