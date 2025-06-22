const { AsyncSeriesHook } = require('tapable');
const hook = new AsyncSeriesHook(['name', 'age']);

console.time('cost');

hook.tapAsync('1', (name, age, callback) => {
  setTimeout(() => {
    console.log(1, name, age);
    callback();
  }, 1000)
});

hook.tapAsync('2', (name, age, callback) => {
  setTimeout(() => {
    console.log(2, name, age);
    callback();
  }, 2000)
});

hook.tapAsync('3', (name, age, callback) => {
  setTimeout(() => {
    console.log(3, name, age);
    callback();
  }, 3000)
});

hook.callAsync('RayseaLee', 24, () => {
  console.timeEnd('cost');
});
// 异步串行
// 1 RayseaLee 24
// 2 RayseaLee 24
// 3 RayseaLee 24
// cost: 6s