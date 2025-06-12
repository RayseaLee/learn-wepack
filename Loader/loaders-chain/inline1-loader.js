function loader(source) {
  console.log('inline1-loader');
  // 如果调用async函数，必须手动调用他返回的callback方法才能继续向后执行loader
  const callback = this.async();
  callback(null, source + '//inline1');
  // return source + '//inline1';
}
loader.pitch = function () {
  console.log('inline1-pitch');
  // return 'inline1-pitch-return'
}
module.exports = loader;