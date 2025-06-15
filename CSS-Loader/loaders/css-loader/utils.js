function getImportCode(imports) {
  let code = '';
  for(item of imports) {
    code += `var ${item.importName} =  require(${item.url});\n`;
  }
  return code;
}

function stringifyRequest(loaderContext, request) {
  return JSON.stringify(loaderContext.utils.contextify(loaderContext.context, request)) 
}

module.exports = {
  getImportCode,
  stringifyRequest
}