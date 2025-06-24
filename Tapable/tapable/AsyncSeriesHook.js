const Hook = require('./Hook');
const HookCodeFactory = require('./HookCodeFactory');
// 代码工厂
class AsyncSeriesHookCodeFactory extends HookCodeFactory {
  content({ onDone }) {
    return this.callTapsAsyncSeries({ onDone });
  }
}
// 创建工厂实例
const factory = new AsyncSeriesHookCodeFactory();
class AsyncSeriesHook extends Hook {
  compile(options) {
    // 初始化工厂
    factory.setup(this, options);
    // 调用代码工厂创建函数
    return factory.create(options);
  }
}

module.exports = AsyncSeriesHook;