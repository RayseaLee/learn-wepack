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
  args() {
    // 获取参数列表
    return this.options.args.join(', ');
  }
  header() {
    let code = '';
    code += `var _x = this._x;\n`;
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
      const tapContent = this.callTap(i);
      code += tapContent
    }
    return code;
  }
  callTap(tapIndex) {
    let code = '';
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n`
    let tapInfo = this.options.taps[tapIndex];
    switch(tapInfo.type) {
      case 'sync':
        code += `_fn${tapIndex}(${this.args()});\n`
        break;
      default:
        break;
    }
    return code;
  }
}

module.exports = HookCodeFactory;