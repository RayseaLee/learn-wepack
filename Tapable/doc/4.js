// AsyncSeriesHook 异步串行钩子  编译后的callAsync函数
function anonymous(name, age, _callback) {
  var _x = this._x;
  function _next1() {
    var _fn2 = _x[2];
    _fn2(name, age, function () {
        _callback();
    });
  }

  function _next0() {
    var _fn1 = _x[1];
    _fn1(name, age, function () {
        _next1();
    });
  }

  var _fn0 = _x[0];
  _fn0(name, age, function () {
      _next0();
  });
}