class Hook {
  constructor(args) {
    if (!Array.isArray(args)) args = [];
    // 保存参数列表
    this.args = args;
    // 用来存放所有的回调函数对象
    this.taps = [];
    // 此变量刚开始是没有值的，后面会设置为回调函数的数组
    this._x = undefined; // this.taps.map(item => item.fn)
    this.call = CALL_DELEGATE;
  }

  /**
   * 注册事件函数或者说回调函数
   * @param {*} options 可以是一个对象，也可以是字符串，如果是字符串等同于{name: 字符串}
   * @param {*} fn 
   */
  tap(options, fn) {
    // 用 tap 注册的就是 sync 类型的tapInfo
    this._tap('sync', options, fn)
  }
  _tap(type, options, fn) {
    if (typeof options === 'string') {
      options = { name: options };
    }
    let tapInfo = {
      ...options,
      type,
      fn
    }
    this._insert(tapInfo);
  }
  _insert(tapInfo) {
    this.taps.push(tapInfo);
  }
  compile(options) {
    throw new Error('子类必须实现此方法');
  }
  _createCall(type) {
    return this.compile({
      type, // 类型
      taps: this.taps, // 回调数组
      args: this.args // 形参数组
    })
  }
}

const CALL_DELEGATE = function(...args) {
  // 动态编译出来一个函数赋给this.call new Function()
  this.call = this._createCall('sync');
  // 返回this.call的结果
  return this.call(...args)
}

module.exports = Hook;