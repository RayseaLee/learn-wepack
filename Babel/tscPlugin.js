const typeMap = {
  TSNumberKeyword: 'NumberLiteral',
  TSStringKeyword: 'StringLiteral',
}
function tscPlugin(options) {
  return {
    pre(file) {
      file.set("errors", []);
    },
    visitor: {
      VariableDeclarator(path, state) {
        const { node } = path;
        const errors = state.file.get("errors");
        const tsType = typeMap[node.id.typeAnnotation.typeAnnotation.type]
        if (node.init.type !== tsType) {
          const stackTraceLimit = Error.stackTraceLimit;
          Error.stackTraceLimit = 0;
          errors.push(
            path.buildCodeFrameError(`无法将${node.init.type}赋值给${tsType}`, Error)
          );
          Error.stackTraceLimit = stackTraceLimit;
        }
      },
    },
    post(file) {
      console.log(...file.get("errors"));
    },
  };
}
module.exports = tscPlugin;
