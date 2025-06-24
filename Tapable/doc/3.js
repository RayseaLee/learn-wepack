// AsyncParallelHook异步并行钩子  promise写法  编译后的promise函数
function anonymous(name, age) {
  var _x = this._x;
  return new Promise((function (_resolve, _reject) {
    var _sync = true;
    var _counter = 3;

    var _done = (function () {
      _resolve();
    });

    var _fn0 = _x[0];
    var _promise0 = _fn0(name, age);
    _promise0.then((function () {
      if (--_counter === 0) _done();
    }));

    var _fn1 = _x[1];
    var _promise1 = _fn1(name, age);
    _promise1.then((function () {
      if (--_counter === 0) _done();
    }));

    var _fn2 = _x[2];
    var _promise2 = _fn2(name, age);
    _promise2.then((function () {
      if (--_counter === 0) _done();
    }));
  }));
}