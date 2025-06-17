const { stringifyRequest } = require('../css-loader/utils')
function loader(sourceCode) {
}

/**
 * pitch 函数
 * @param {*} remainingRequest 剩下的请求
 */
loader.pitch = function (remainingRequest) {
  console.log('remainingRequest', remainingRequest);
  console.log(stringifyRequest(this, `!!${remainingRequest}`));
  // require(!!../loaders/css-loader/index.js??ruleSet[1].rules[0].use[1]!./index.css)
  // 先加载index.css文件，再去执行css-loader
  // !! 表示只要行内loader，不加的话webpack会在读取配置的loader后进入死循环
  let contentCode = `
    let content = require(${stringifyRequest(this, `!!${remainingRequest}`)});
    let element = document.createElement('style');
    element.innerHTML = content.toString();
    document.head.appendChild(element);
  `
  return contentCode
}

// 为什么要在style-loader的pitch中执行这个操作？而不用style-loader的normal呢？
// normal接收的参数是sourceCode，按照流程执行即为css-loader执行后的sourceCode，为js源代码，style-loader的normal拿到这个并不能进行处理拿到需要的css代码块
// 在pitch中执行，接收参数可以拿到remainingRequest，通过require加载，会使webpack开始新的一轮loader-runner，去执行读取css文件和执行css-loader

// 结论：
// pitch使用场景：
// 如果当前的loader的下一个loader返回的是一段js代码，那就只能用pitch来加载它获取模块的返回值

module.exports = loader;