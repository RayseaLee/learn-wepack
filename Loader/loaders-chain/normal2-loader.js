function loader(source) {
  console.log('normal2-loader');
  return source + '//normal2';
}
loader.pitch = function () {
  console.log('normal2-pitch');
  return '//normal2-pitch';
}
module.exports = loader;