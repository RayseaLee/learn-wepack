const { SyncLoopHook } = require('tapable');
const hook = new SyncLoopHook(['name', 'age']);

let counter1 = 0;
let counter2 = 0;
let counter3 = 0;

hook.tap('1', (name, age) => {
  console.log(1, name, age, counter1);
  if (++counter1 === 1) {
    counter1 = 0
    return undefined;
  }
  return true;
});

hook.tap('2', (name, age) => {
  console.log(2, name, age, counter2);
  if (++counter2 === 2) {
    counter2 = 0
    return undefined;
  }
  return true;
});

hook.tap('3', (name, age) => {
  console.log(3, name, age, counter3);
  if (++counter3 === 3) {
    counter3 = 0
    return undefined;
  }
  return true;
});

hook.call('RayseaLee', 24);
// 不停的循环执行事件函数，直到所有函数结果 result === undefined, 若遇到非undefined的返回值，从头开始循环执行
// 1 RayseaLee 24 0
// 2 RayseaLee 24 0
// 1 RayseaLee 24 0
// 2 RayseaLee 24 1
// 3 RayseaLee 24 0

// 1 RayseaLee 24 0
// 2 RayseaLee 24 0
// 1 RayseaLee 24 0
// 2 RayseaLee 24 1
// 3 RayseaLee 24 1

// 1 RayseaLee 24 0
// 2 RayseaLee 24 0
// 1 RayseaLee 24 0
// 2 RayseaLee 24 1
// 3 RayseaLee 24 2