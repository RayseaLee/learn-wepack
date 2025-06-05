// Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse,并实现了插件功能
const babelCore = require('@babel/core')
// 用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用
const types = require('@babel/types')
// const transformClassesPlugin = require('@babel/plugin-transform-classes')

const transformClassesPlugin = {
  visitor: {
    // 当遍历语法遇到class类的时候，执行此函数
    ClassDeclaration(path) {
      const node = path.node;
      const id = node.id; // Identifier name:Person
      let classMethods = node.body.body; // Array<MethodDefinition> 类下面的方法
      let newNodes = []; // 将要生成的新节点数组
      classMethods.forEach(classMethod => {
        if (classMethod.kind === 'constructor') {
          const constructorFunction = types.functionDeclaration(
            id,
            classMethod.params,
            classMethod.body
          )
          newNodes.push(constructorFunction);
        } else {
          const memberExpression = types.memberExpression(
            types.memberExpression(
              id, // Person
              types.identifier('prototype') // .prototype
            ),
            classMethod.key // .getName
          );
          const functionExpression = types.functionExpression(
            null, // 无命名为null
            classMethod.params,
            classMethod.body
          );
          const assignmentExpression = types.assignmentExpression(
            '=',
            memberExpression, // Person.prototype.getName
            functionExpression // function() {return this.name;}
          );
          newNodes.push(assignmentExpression);
        }
      });
      // 如果新创建的节点数量为1
      if (newNodes.length === 1) {
        // 在path路径上，用唯一的一个新节点替换掉老节点
        path.replaceWith(newNodes[0]);
      } else {
        // 如果新节点是多个的话，使用多个节点替换一个节点
        path.replaceWithMultiple(newNodes);
      }
    }
  }
}

let sourceCode = `
  class Person {
    constructor(name) {
      this.name = name;
    }
    getName() {
      return this.name;
    }
  }
`

const targetSource = babelCore.transform(sourceCode, {
  plugins: [
    transformClassesPlugin
  ]
})

console.log(targetSource.code);
// function Person(name) {
//   this.name = name;
// }
// Person.prototype.getName = function () {
//   return this.name;
// }
