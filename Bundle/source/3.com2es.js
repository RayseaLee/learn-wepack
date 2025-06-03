// esmodule导出模块、commonjs导入模块
// export default 'title_name';
// export const age = 'title_age';

// const title = require('./src/title.js');
// console.log(title.default);
// console.log(title.age);

// 模块对象
var modules = {
  './src/title.js': (module, exports) => {
    // 声明或者说表示当前的模块是一个es module
    __webpack_require__.r(exports)
    // 遍历模块赋值default和命名导出到exports上
    __webpack_require__.d(exports, {
      default: () => DEFAULT_EXPORTS,  // 值是一个getter
      age: () => age,
    })
    // 默认导出
    const DEFAULT_EXPORTS = 'title_name';
    // 命名导出
    const age = 'title_age';
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

// 遍历模块赋值default和命名导出到exports上
__webpack_require__.d = (exports, definition) => {
  for (var key in definition) {
    Object.defineProperty(exports, key, {
      get: definition[key]
    })
  }
}

// 用法
const title = __webpack_require__('./src/title.js')
console.log(title.default); // title_name
console.log(title.age); // title_age
