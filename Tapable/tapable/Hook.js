class Hook {
  constructor(args) {
    if (!Array.isArray(args)) args = [];
    // 保存参数列表
    this.args = args;
    // 用来存放所有的回调函数对象
    this.taps = [];
    // 此变量刚开始是没有值的，后面会设置为回调函数的数组
    this._x = undefined; // this.taps.map(item => item.fn)
    // 拦截器
    this.interceptors = [];
    this.call = CALL_DELEGATE;
    this.callAsync = CALL_ASYNC_DELEGATE;
    this.promise = PROMISE_DELEGATE;
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
  tapAsync(options, fn) {
    this._tap('async', options, fn)
  }
  tapPromise(options, fn) {
    this._tap('promise', options, fn)
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
    // 注册拦截器可以用来对tapInfo做一些修改
    tapInfo = this._runRegisterInterceptors(tapInfo);
    this._insert(tapInfo);
  }
  intercept(interceptor) {
    this.interceptors.push(interceptor);
  }
  _runRegisterInterceptors(tapInfo) {
    for (const interceptor of this.interceptors) {
      if (interceptor.register) {
        let newTapInfo = interceptor.register(tapInfo);
        if (newTapInfo) {
          tapInfo = newTapInfo;
        }
      }
    }
    return tapInfo;
  }
  _insert(tapInfo) {
    let stage = 0;
    if (typeof tapInfo.stage === 'number') {
      stage = tapInfo.stage;
    } 
    let before;
    if (typeof tapInfo.before === 'string') {
      before = new Set([tapInfo.before]);
    } else if (Array.isArray(tapInfo.before)) {
      before = new Set(tapInfo.before);
    }
    let i = this.taps.length;
    // 插入排序 按照stage升序的方式将tapInfo插入到正确的位置
    while (i > 0) {
      i--;
      const compareTap = this.taps[i];
      this.taps[i + 1] = compareTap;
      const compareStage = compareTap.stage || 0;
      if (before) {
        if (before.has(compareTap.name)) {
          before.delete(compareTap.name);
          continue;
        }
        if (before.size > 0) {
          continue;
        }
      }
      // 如果被比较的元素的stage大于要插入的stage，继续遍历
      if (compareStage > stage) {
        continue;
      }
      i++;
      break;
    }
    this.taps[i] = tapInfo;
  }
  compile(options) {
    throw new Error('子类必须实现此方法');
  }
  _createCall(type) {
    return this.compile({
      type, // 类型 sync async promise
      taps: this.taps, // 回调数组
      args: this.args, // 形参数组
      interceptors: this.interceptors // 拦截器
    })
  }
}

const CALL_DELEGATE = function(...args) {
  // 动态编译出来一个函数赋给this.call new Function()
  this.call = this._createCall('sync');
  // 返回this.call的结果
  return this.call(...args)
}
const CALL_ASYNC_DELEGATE = function(...args) {
  // 动态编译出来一个函数赋给this.callAsync new Function()
  this.callAsync = this._createCall('async');
  // 返回this.callAsync的结果
  return this.callAsync(...args)
}
const PROMISE_DELEGATE = function(...args) {
  // 动态编译出来一个函数赋给this.promise new Function()
  this.promise = this._createCall('promise');
  // 返回this.promise的结果
  return this.promise(...args)
}

module.exports = Hook;