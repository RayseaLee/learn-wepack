function loader(source) {
  console.log('normal1-loader');
  console.log('context.age: ', this.age);
  return source + '//normal1';
}
loader.pitch = function () {
  console.log('normal1-pitch');
}
module.exports = loader;