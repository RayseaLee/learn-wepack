// commonjs导出模块、esmodule导入模块
// module.exports = {
//   name: "title_name",
//   age: "title_age",
// };

// import name, { age } from './src/title.js';


// 模块对象
var modules = {
  './src/title.js': (module, exports) => {
    exports.name = 'title_name';
    exports.age = 'title_age';
  }
}

// 缓存对象
var __webpack_module_cache__ = {};
// 模块运行时
function __webpack_require__(moduleId) {
  // 先读缓存
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (__webpack_module_cache__[moduleId] = {
    exports: {},
  });
  modules[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}

// 声明或者说表示当前的模块是一个es module
__webpack_require__.r = (exports) => {
  // 设置Object.prototype.toString.call(exports) === '[object Module]'
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  // 标记模块上的__esModule为true
  Object.defineProperty(exports, '__esModule', { value: true });
}

__webpack_require__.n = (exports) => {
  return exports.__esModule ? () => exports.default : () => exports;
}


// 用法
var __webpack__exports = {}
__webpack_require__.r(__webpack__exports)
var title = __webpack_require__('./src/title.js')
// 如果原来title是esmodule，取defaul属性，如果是commonjs，那就取exports本身
var titleDefault = __webpack_require__.n(title)
console.log(titleDefault()); // title_name
console.log(title.age); // title_age