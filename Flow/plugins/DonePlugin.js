class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('DonePlugin', () => {
      console.log('done plugin');
    })
  }
}

module.exports = DonePlugin;