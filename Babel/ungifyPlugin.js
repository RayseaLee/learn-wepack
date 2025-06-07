function ungifyPlugin() {
  return {
    visitor: {
      Scopable(path) {
        Object.entries(path.scope.bindings).forEach(([key, binding]) => {
          const newName = path.scope.generateUid('_')
          binding.path.scope.rename(key, newName)
        })
      }
    }
  }
}

module.exports = ungifyPlugin