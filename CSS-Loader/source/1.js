const modules = {
  './src/index.css': (module, exports, webpackRequire) => {
    // 用来获取数组中的第二个元素
    const noSourceMaps = webpackRequire("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
    const api = webpackRequire('./node_modules/css-loader/dist/runtime/api.js');
    const cssloaderExport = api(noSourceMaps);
    cssloaderExport.push([module.id, "body {\r\ncolor: red;\r\n}", ''])
    module.exports = cssloaderExport;
  },
  './node_modules/css-loader/dist/runtime/noSourceMaps.js': (module) => {
    module.exports = function (i) {
      return i[1];
    };
  },
  './node_modules/css-loader/dist/runtime/api.js': (module) => {
    module.exports = (cssWithMappingToString) => {
      const list = [];
      list.toString = function toString() { 
        return this.map(item => {
          let content = '';
          content += cssWithMappingToString(item);
          return content;
        }).join('\r\n')
      };
      return list;
    }
  }
}

const cache = {};
function webpackRequire(moduleId) {
  const cachedModule = cache[moduleId];
  if(cachedModule !== undefined) {
    return cachedModule.exports;
  }
  const module = (cache[moduleId] = {
    id: moduleId,
    exports: {} 
  })
  modules[moduleId](module, module.exports, webpackRequire)
  return module.exports;
}


const indexCss = webpackRequire("./src/index.css");
console.log(indexCss);
