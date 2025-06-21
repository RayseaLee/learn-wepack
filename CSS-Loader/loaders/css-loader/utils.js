const postcssModulesScope = require('./plugins/postcss-modules-scope')

function getImportCode(imports) {
  let code = '';
  for(item of imports) {
    code += `var ${item.importName} =  require(${item.url});\n`;
  }
  return code;
}

function getModuleCode(result, api, replacements) {
  let code = JSON.stringify(result.css);
  let beforeCode = `var cssLoaderExport = cssLoaderApiImport(cssLoaderApiNoSourcemapImport);\r\n`
  for (const item of api) {
    beforeCode += `cssLoaderExport.i(${item.importName});\r\n`
  }
  for (const item of replacements) {
    const { importName, replacementName } = item;
    beforeCode += `var ${replacementName} = cssLoaderGetUrlImport(${importName});\r\n`
    code = code.replace(
      new RegExp(`'${replacementName}'`, 'g'),
      () => `"+${replacementName}+"`
    );
  }
  return `${beforeCode}cssLoaderExport.push([module.id, ${code}, ""]);\r\n`;
}

function getExportCode(exports, options) {
  let code = '';
  let localsCode = '';
  function addExportToLocalsCode(name, value) {
    if (localsCode) {
      localsCode += ',\n';
    }
    localsCode += `${JSON.stringify(name)}: ${JSON.stringify(value)}`;
  }
  for (const { name, value } of exports) {
    addExportToLocalsCode(name, value);
  }
  if (options.modules.exportOnlyLocals) {
    return `${options.esModule ? 'export default' : 'module.exports ='} {\n
      ${localsCode}\n
    };\n;`
  }
  code += `cssLoaderExport.locals = {\n
    ${localsCode}\n
  };\n`;
  code += `${options.esModule ? 'export default' : 'module.exports ='} cssLoaderExport;`;
  return code;
}

/**
 * 用于把请求字符串（一般是绝对路径）变成相对于当前正在转换模块的相对路径
 * @param {*} imports 
 */
function stringifyRequest(loaderContext, request) {
  // contextify是新的方法，用来计算相对路径
  // loaderContext.context 当前正在转换的模块的绝对路径
  // loaderContext.context=D:\code\learn\webpack\CSS-Loader\src
  // request=D:\code\learn\webpack\CSS-Loader\loaders\css-loader\runtime\api.js
  return JSON.stringify(loaderContext.utils.contextify(loaderContext.context, request)) 
}

// 合并请求
function combineLoaders(preRequest, request) {
  return preRequest + request;
}

// 获取要执行几个loader
// loaders：所有的loader loaderIndex：当前正在执行的loader的索引 importLoaders：是用户配置的要执行的loader数
function getPreRequester({ loaders, loaderIndex }, { importLoaders = 0 }) {
  const loaderRequest = loaders
  .slice(loaderIndex, loaderIndex + importLoaders + 1)
  .map(n => n.request)
  .join('!');
  // 只要行内loader
  return `!!${loaderRequest}!`
}

function getModulesPlugins(loaderContext) {
  let plugins = [postcssModulesScope({ loaderContext })];
  return plugins;
}


module.exports = {
  getImportCode,
  getModuleCode,
  getExportCode,
  stringifyRequest,
  combineLoaders,
  getPreRequester,
  getModulesPlugins
}