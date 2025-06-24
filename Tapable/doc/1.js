// SyncHook 同步钩子 编译后的call函数
function anonymous(name, age) {
  var _x = this._x;

  var _fn0 = _x[0];
  _fn0(name, age);

  var _fn1 = _x[1];
  _fn1(name, age);

  var _fn2 = _x[2];
  _fn2(name, age);
}