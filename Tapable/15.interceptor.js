// const { SyncHook } = require('tapable');
const { SyncHook } = require('./tapable');
const syncHook = new SyncHook(["name","age"]);

// 注册拦截器对象
syncHook.intercept({
  // 每当你调用 tap 方法, 注册一个 tapInfo 都会触发 register 方法
  register: (tapInfo) => {
    console.log('拦截器1开始register', tapInfo.name);
    tapInfo.name = tapInfo.name + 'Lee'
    tapInfo.age = tapInfo.age + 'ext'
    return tapInfo;
  },
  // 当调用钩子的 call 方法后, 会触发回调函数执行
  tap: (tapInfo) => {
    console.log('拦截器1开始tap', tapInfo.name);
  },
  // 当调用 call 方法的时候会执行此方法, 一次 call 只会走一次
  call: (name, age) => {
    console.log('拦截器1开始call', name, age);
  },
})

syncHook.intercept({
  // 每当你调用 tap 方法, 注册一个 tapInfo 都会触发 register 方法
  register: (tapInfo) => {
    console.log('拦截器2开始register', tapInfo.name);
    return tapInfo;
  },
  // 当调用钩子的 call 方法后, 会触发回调函数执行, 每个回调函数执行都会调用此 tap 方法
  tap: (tapInfo) => {
    console.log('拦截器2开始tap', tapInfo.name);
  },
  // 当调用 call 方法的时候会执行此方法, 一次 call 只会走一次
  call: (name, age) => {
    console.log('拦截器2开始call', name, age);
  },
})

syncHook.tap({ name: '回调函数1名称'}, (name, age) => {
  console.log('回调函数1执行', name, age);
})

syncHook.tap({ name: '回调函数2名称'}, (name, age) => {
  console.log('回调函数2执行', name, age);
})
debugger
syncHook.call('raysea', 24)

// syncHook.tap(...)
// 拦截器1开始register 回调函数1
// 拦截器2开始register 回调函数1
// 拦截器1开始register 回调函数2
// 拦截器2开始register 回调函数2

// syncHook.call(...)
// 拦截器1开始call rayseaLee 24
// 拦截器2开始call rayseaLee 24

// (name, age) => {
//   console.log('回调函数1', name, age);
// }
// 拦截器1开始tap 回调函数1
// 拦截器2开始tap 回调函数1
// 回调函数1 rayseaLee 24

// (name, age) => {
//   console.log('回调函数2', name, age);
// }
// 拦截器1开始tap 回调函数2
// 拦截器2开始tap 回调函数2
// 回调函数2 rayseaLee 24
