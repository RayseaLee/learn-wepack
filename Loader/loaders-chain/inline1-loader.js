function loader(source) {
  console.log('inline1');
  return source + '//inline1';
}
loader.pitch = function () {
  console.log('inline1-pitch');
  // return 'inline1-pitch-return'
}
module.exports = loader;