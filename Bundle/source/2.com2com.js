// commonjs导出模块、commonjs导入模块
// exports.name = 'title_name';
// exports.age = 'title_age';

// const title = require('./src/title.js');
// console.log(title.name);
// console.log(title.age);

// 使用一个对象来存储对应的模块, key为对应的moduleId,是相对src的相对路径
var __webpack_modules__ = {
  "./src/title.js": (__unused_webpack_module, exports) => {
    exports.name = "title_name";
    exports.age = "title_age";
  },
};
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (__webpack_module_cache__[moduleId] = {
    exports: {},
  });
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}
var __webpack_exports__ = {};

// 用法
let title = __webpack_require__("./src/title.js");
console.log(title.name);
console.log(title.age);
