const { getImportCode, stringifyRequest, getModuleCode, getExportCode } = require('./utils');
/**
 * css-loader
 * @param {*} content css代码
 */
function loader(content) {
  const callback = this.async();
  const options = this.getOptions();
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
  const importCode = getImportCode(imports);
  const moduleCode = getModuleCode({ css: content });
  const exportCode = getExportCode(options);
  callback(null, `${importCode}${moduleCode}${exportCode}`);
}

module.exports = loader;