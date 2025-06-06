function noConsolePlugin(options) {
  return {
    pre(file) {
      file.set("errors", []);
    },
    visitor: {
      CallExpression(path, state) {
        const { node } = path;
        const errors = state.file.get("errors");
        if (node.callee.object && node.callee.object.name === "console") {
          const stackTraceLimit = Error.stackTraceLimit;
          Error.stackTraceLimit = 0;
          errors.push(
            path.buildCodeFrameError(`代码中不能出现console语句`, Error)
          );
          Error.stackTraceLimit = stackTraceLimit;
          if (options.fix) {
            //如果需要自动修复，就删除此语句
            path.parentPath.remove();
          }
        }
      },
    },
    post(file) {
      console.log(...file.get("errors"));
    },
  };
}
module.exports = noConsolePlugin;
