const { SyncBailHook } = require('tapable');

const hook = new SyncBailHook(['name', 'age'])

hook.tap('1', (name, age) => {
  console.log(1, name, age);
  return true;
});

hook.tap('2', (name, age) => {
  console.log(2, name, age);
});

hook.tap('3', (name, age) => {
  console.log(3, name, age);
});

hook.call('RayseaLee', 24);
// 执行每一个事件函数，遇到第一个结果 result !== undefined 则返回，不再继续执行。
// 1 RayseaLee 24