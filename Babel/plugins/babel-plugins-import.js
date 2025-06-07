const template = require('@babel/template');
const types = require('@babel/types');
function babelPluginsImport() {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { node } = path;
        const {libraryName, libraryDirectory = 'lib'} = state.opts;
        if (node.source.value === libraryName) {
          const newImportDeclaration = node.specifiers.map(specifier => {
            // 使用template模板创建导入语句
            return template.statement(`import ${specifier.local.name} from '${libraryName}/${specifier.local.name}'`)()
            // 使用types手动创建导入语句
            // return types.importDeclaration(
            //   [types.importDefaultSpecifier(specifier.local)],
            //   types.stringLiteral(
            //     libraryDirectory ? `${libraryName}/${libraryDirectory}/${specifier.local.name}` : `${libraryName}/${specifier.local.name}`
            //   )
            // )
          })
          path.replaceWithMultiple(newImportDeclaration)
        }
      }
    }
  }
}

module.exports = babelPluginsImport