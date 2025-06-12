function loader(source) {
  console.log('pre2-loader');
  return source + '//pre2';
}
loader.pitch = function () {
  console.log('pre2-pitch');
}
module.exports = loader;