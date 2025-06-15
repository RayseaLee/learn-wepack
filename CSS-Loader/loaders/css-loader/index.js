const { getImportCode, stringifyRequest } = require('./utils');
function loader(content) {
  const callback = this.async();
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
  const moduleCode = '';
  const exportCode = '';
  callback(null, `${importCode}${moduleCode}${exportCode}`);
}

module.exports = loader;