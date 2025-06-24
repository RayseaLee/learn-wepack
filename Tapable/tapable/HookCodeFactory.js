class HookCodeFactory {
  constructor() {
    this.options = {};
  }
  /**
   * 初始化hook代码工厂
   */
  setup(hookInstance, options) {
    // 把回调函数全部取出来变成数组赋给_x
    hookInstance._x = options.taps.map(item => item.fn);
  }
  init(options) {
    // 把选项对象保存到工厂的options属性上
    this.options = options;
  }
  // 获取参数列表
  args(options = {}) {
    let allArgs = this.options.args;
    const { before, after } = options;
    if (before) {
      allArgs = [before, ...allArgs]
    }
    if (after) {
      allArgs = [...allArgs, after]
    }
    if (allArgs.length > 0) {
      return allArgs.join(', ');
    }
    return '';
  }
  header() {
    let code = '';
    code += `var _x = this._x;\n`;
    const { interceptors } = this.options;
    if (interceptors.length > 0) {
      code += `var _taps = this.taps;\n`
      code += `var _interceptors = this.interceptors;\n`
    }
    for (let i = 0; i < interceptors.length; i++) {
      const interceptor = interceptors[i];
      if (interceptor.call) {
        code += `_interceptors[${i}].call(${this.args()});\n`
      }
    }
    return code;
  }
  create(options) {
    this.init(options);
    let fn;
    switch (options.type) {
      case 'sync':
        fn = new Function(
          this.args(), // name, age
          this.header() + this.content(),
        )
        break;
      case 'async':
        fn = new Function(
          this.args({ after: '_callback' }), // name, age, callback
          this.header() + this.content({onDone: () => `_callback();`}),
        )
        break;
      case 'promise':
        let tabsContent = this.content({ onDone: () => `_resolve();`});
        const content = `
          return new Promise((function (_resolve, _reject) {
            ${tabsContent}
          }));
        `;
        fn = new Function(
          this.args(), // name, age
          this.header() + content,
        )
        break;
      default:
        break;
    }
    return fn;
  }
  callTapsSeries() {
    if (this.options.taps.length === 0) {
      return '';
    }
    let code = '';
    for (let i = 0; i < this.options.taps.length; i++) {
      const tapContent = this.callTap(i, {});
      code += tapContent
    }
    return code;
  }
  callTapsAsyncSeries({ onDone }) {
    let { taps = [] } = this.options;
    if (taps.length === 0) return onDone(); // _callback();
    let code = '';
    let current = onDone;
    for (let j = taps.length - 1; j >= 0; j--) {
      const i = j;
      // 如果 current !== onDone, 需要包裹一下
      const unroll = current !== onDone;
      if(unroll) {
        code += `function _next${i}() {\n`;
        code += current();
        code += `}\n`;
        current = () => `_next${i}();`
      }
      const done = current;
      const content = this.callTap(i, { onDone: done });
      current = () => content;
    }
    code += current();
    return code;
  }
  callTapsParallel({ onDone }) {
    let { taps = [] } = this.options;
    let code = `var _counter = ${taps.length};\n`;
    code += `
      var _done = (function() {
        ${onDone()}
      });
    `
    for (let i = 0; i < taps.length; i++) {
      const tapContent = this.callTap(i);
      code += tapContent
    }
    return code;
  }
  callTap(tapIndex, { onDone }) {
    let code = '';
    const { interceptors } = this.options;
    if (interceptors.length > 0) {
      code += `var _tap${tapIndex} = _taps[${tapIndex}];\n`;
      for (let i = 0; i < interceptors.length; i++) {
        const interceptor = interceptors[i];
        if (interceptor.tap) {
          code += `_interceptors[${i}].tap(_tap${tapIndex});\n`
        }
      }
    }
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n`
    let tapInfo = this.options.taps[tapIndex];
    switch(tapInfo.type) {
      case 'sync':
        code += `_fn${tapIndex}(${this.args()});\n`
        break;
      case 'async':
        let cbCode = `function() {\n`;
        if (onDone) cbCode += onDone(); // _callback();
        cbCode += `}`
        code += `
          _fn${tapIndex}(${this.args({
            after: cbCode
          })});
        `
        break;
      case 'promise':
        code += `
          var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
          _promise${tapIndex}.then((function () {
            if (--_counter === 0) _done();
          }));
        `
        break;
      default:
        break;
    }
    return code;
  }
}

module.exports = HookCodeFactory;