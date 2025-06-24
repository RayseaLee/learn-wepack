// AsyncParallelHook 异步并行钩子 callback写法 编译后的callAsync函数
function anonymous(name, age, _callback) {
  var _x = this._x;
  var _counter = 3;
  var _done = (function () {
    _callback();
  });
  
  var _fn0 = _x[0];
  _fn0(name, age, (function (_err0) {
      if (--_counter === 0) _done();
  }));

  var _fn1 = _x[1];
  _fn1(name, age, (function (_err1) {
      if (--_counter === 0) _done();
  }));

  var _fn2 = _x[2];
  _fn2(name, age, (function (_err2) {
      if (--_counter === 0) _done();
  }));
}