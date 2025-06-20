// 导出一个函数，输入参数为 cssWithMappingToString 函数
module.exports = cssWithMappingToString => {
    // 创建一个 list 数组用于存储 CSS 模块
    const list = [];
    // 为 list 定义一个 toString 方法，将 list 中的每个 CSS 模块转换为字符串，并用换行符连接
    list.toString = function toString() {
      return this.map(item => {
          let content = "";
          content += cssWithMappingToString(item);
          return content;
      }).join("\r\n");
    };

    list.i = function i(modules) {
      console.log(modules);
      if (modules.length) {
        return list.push(...modules)
      }
    }
  return list;
};