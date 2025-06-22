const { SyncWaterfallHook } = require('tapable');
const hook = new SyncWaterfallHook(['name', 'age']);

hook.tap('1', (name, age) => {
  console.log(1, name, age);
  return 'hello';
});

hook.tap('2', (name, age) => {
  console.log(2, name, age);
  return 'world';
});

hook.tap('3', (name, age) => {
  console.log(3, name, age);
});

hook.call('RayseaLee', 24);
// 如果前一个事件函数的结果 result !== undefined,则 result 会作为后一个事件函数的第一个参数
// 1 RayseaLee 24
// 2 hello 24
// 3 world 24