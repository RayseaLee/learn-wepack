// webpack内部 是通过tapable实现的插件机制
const { SyncHook } = require('tapable')

let hook = new SyncHook();

// hook.tap('pluginName', () => {
//   console.log('插件的名称');
// })

// hook.call()

// 一般我们会编写插件，在插件的apply方法里去订阅钩子
class SomePlugin {
  apply() {
    hook.tap('pluginName', () => {
      console.log('插件的名称');
    })
  }
}

const somePlugin = new SomePlugin()
somePlugin.apply()

// 在webpack的工作流中，会去执行hook.call方法实现发布
hook.call();