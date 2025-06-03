// 模块定义
// key是模板id，也就是模块相对于当前根目录的相对路径
var modules = {
  './src/title.js': (module) => {
    module.exports = 'title';
  }
}
function require(moduleId) {
  var module = {
    exports: {}
  }
  modules[moduleId](module, module.exports, require);
  return module.exports;
}

let title = require('./src/title.js');
console.log(title);
