// esmodule导出模块、esmodule导入模块
// export default 'title_name';
// export const age = 'title_age';

// import name, { age } from './src/title.js';

var modules = {
  './src/title.js': (module, exports) => {
    __webpack__require.r(exports)
    __webpack__require.d(exports, {
      age: () => age,
      default: () => DEFAULT_VALUE
    })
    const DEFAULT_VALUE = 'title_name';
    const age = 'title_age';
  }
}

function __webpack__require(moduleId) {
  var module = {
    exports: {}
  }
  modules[moduleId](module, module.exports, __webpack__require)
  return module.exports
}

__webpack__require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  Object.defineProperty(exports, '__esModule', { value: true });
}

__webpack__require.d = (exports, definition) => {
  for (var key in definition) {
    Object.defineProperty(exports, key, {
      get: definition[key]
    })
  }
}

var __webpack__exports = {};
__webpack__require.r(__webpack__exports)
const title = __webpack__require('./src/title.js')
console.log(title.default);
console.log(title.age);
