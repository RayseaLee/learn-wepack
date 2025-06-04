var modules = {};
function require(moduleId) {
  var module = {
    exports: {},
  };
  modules[moduleId](module, module.exports, require);
  return module.exports;
}

require.r = (exports) => {
  if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  }
  Object.defineProperty(exports, '__esModule', { value: true });
};
require.d = (exports, definition) => {
  for(var key in definition) {
    if(require.o(definition, key) && !require.o(exports, key)) {
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
    }
  }
};
require.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))

require.f = {};
// 各个状态下的代码块
// undefined = 模块未加载
// null = 模块预加载
// [resolve, reject, Promise] = 加载中
// 0 = 加载完成
var installedChunks = {
  main: 0 // 代码块名称为main的已经加载完成
};
// 代码块地址
require.p = '';
// 返回代码块chunk的文件名
require.u = (chunkId) => `${chunkId}.main.js`;
// 创建script标签添加到head
require.l = (url) => {
  const script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script);
}
// jsonP
require.f.j = (chunkId, promises) => {
  let installedChunkData;
  let promise = new Promise((resolve, reject) => {
    installedChunkData = installedChunks[chunkId] = [resolve, reject]
  });
  installedChunkData[2] = promise;
  promises.push(promise);
  // 获取异步代码块的路径
  const url = require.p + require.u(chunkId);
  // 创建script脚本
  require.l(url);
}

require.e = (chunkId) => { 
  let promises = [];
  require.f.j(chunkId, promises);
  return Promise.all(promises);
};

debugger;
require.e("src_title_js").then(() => {
  return require("./src/title.js");
}).then(exports => {
  console.log(exports);
})

/* 动态加载的模块：src_title_js.main.js */
var chunkLoadingGlobal = window['webpackChunkbundle'] = [];
chunkLoadingGlobal.push = webpackJsonpCallback;

function webpackJsonpCallback([chunkIds, moreModules]) {
  debugger;
  const resolves = [];
  for (let i = 0; i < chunkIds.length; i++) {
    const chunkId = chunkIds[i]; // src_title_js
    const resolve = installedChunks[chunkId][0]; // resolve
    resolves.push(resolve)
    // 到这里此代码块就已经加载成功了，可以把chunkId的值设置为0
    installedChunks[chunkId] = 0;
  }
  for (const moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId];
  }
  while (resolves.length) {
    // 取出所有的 resolve 方法，让它执行，让对应的promise变成成功态
    resolves.shift()();
  }
}
