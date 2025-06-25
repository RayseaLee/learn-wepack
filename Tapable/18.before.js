const { SyncHook } = require('./tapable');
const hook = new SyncHook(['name']);

hook.tap({name: 'tap1'}, (name) => {
  console.log(1, name);
});
hook.tap({name: 'tap3'}, (name) => {
  console.log(3, name);
});
hook.tap({name: 'tap5'}, (name) => {
  console.log(5, name);
});
hook.tap({name: 'tap2', before: ['tap3', 'tap5']}, (name) => {
  console.log(2, name);
});
hook.tap({name: 'tap4', before: 'tap5'}, (name) => {
  console.log(4, name);
});
hook.call('Lee')

// 1 Lee
// 2 Lee
// 3 Lee
// 4 Lee
// 5 Lee