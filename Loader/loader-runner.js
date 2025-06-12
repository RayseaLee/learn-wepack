// loader: D:\code\learn\webpack\Loader\loaders\babel-loader.js
function createLoaderObject(loader) {
  let normal = require(loader);
  let pitch = normal.pitch;
  // 在weboack里一切皆模块，这些文件可能是文本JS，也可能是二进制的图片，字体
  // raw=true Buffer; raw=false 字符串
  let raw = normal.raw || true; // 决定是字符串还是Buffer
  return {
    path: loader, // loader的路径
    normal, // normal函数
    pitch: pitch, // pitch函数
    normalExecuted: false, // 此loader的normal函数是否已经执行过了
    pitchExecuted: false, // 此loader的pitch函数是否已经执行过了
    data: {}, // 每个loader会配一个自己的data对象，用来保存一些自定义数据
    raw
  }
}

// Buffer和字符串参数转换
function convertArgs(args, raw) {
  if (raw && !Buffer.isBuffer(args[0])) {
    args[0] = Buffer.from(args[0])
  } else if (!raw && Buffer.isBuffer(args[0])) {
    args[0] = args[0].toString();
  }
}

function iterateNormalLoader(processOptions, loaderContext, args, pitchingCallback) {
  if (loaderContext.loaderIndex < 0) {
    return pitchingCallback(null, args)
  }
    // 获取当前的loader对象
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  let fn = currentLoader.normal;
  // 如果normal方法已经执行过了，执行下一个loader
  if (currentLoader.normalExecuted) {
    loaderContext.loaderIndex--;
    return iterateNormalLoader(processOptions, loaderContext, args, pitchingCallback)
  }
  currentLoader.normalExecuted = true;
  // Buffer和字符串参数转换
  convertArgs(args, currentLoader.raw);
  // 将loaderContext做为this同步或异步执行loader
  runSyncOrAsync(fn, loaderContext, args, (err, ...returnArgs) => {
    return iterateNormalLoader(processOptions, loaderContext, returnArgs, pitchingCallback)
  })
}

// 读取代码文件
function processResource(processOptions, loaderContext, pitchingCallback) {
  processOptions.readResource(loaderContext.resourcePath, (err, resourceBuffer) => {
    // 读取要转换的源文件内容存入resourceBuffer
    processOptions.resourceBuffer = resourceBuffer;
    // 往左执行loader转换
    loaderContext.loaderIndex--;
    // 调用loader迭代执行
    iterateNormalLoader(processOptions, loaderContext, [resourceBuffer], pitchingCallback)
  })
}

// 迭代执行pitch
function iteratePitchingLoader(processOptions, loaderContext, pitchingCallback) {
  // pitch执行完毕，开始处理资源
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(processOptions, loaderContext, pitchingCallback)
  }
  // 获取当前的loader对象
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  let fn = currentLoader.pitch;
  // 如果pitch方法已经执行过了，执行下一个pitch
  if (currentLoader.pitchExecuted) {
    loaderContext.loaderIndex++;
    return iteratePitchingLoader(processOptions, loaderContext, pitchingCallback)
  }
  currentLoader.pitchExecuted = true;
  // 如果pitch方法不存在，继续递归执行
  if (!fn) {
    return iteratePitchingLoader(processOptions, loaderContext, pitchingCallback)
  }
  // 将loaderContext做为this同步或异步执行pitch方法
  runSyncOrAsync(fn, loaderContext, [
    loaderContext.remainingRequest, loaderContext.previousRequest, loaderContext.data
  ], (err, ...args) => {
    // 如果pitch方法有返回值
    if(args.length > 0 && args.some(item => item)) {
      loaderContext.loaderIndex--;
      return iterateNormalLoader(processOptions, loaderContext, args, pitchingCallback)
    } else {
      return iteratePitchingLoader(processOptions, loaderContext, pitchingCallback)
    }
  })
}

function runSyncOrAsync(fn, loaderContext, args, runCallback) {
  // 标识当前函数的执行是同步还是异步，默认是同步
  let isSync = true;
  loaderContext.callback = (err, ...args) => {
    runCallback(err, ...args)
  }
  // 返回callback函数等待后续，手动的异步调用callback，进而执行runCallback
  loaderContext.async = () => {
    isSync = false;
    return loaderContext.callback
  }
  let result = fn.apply(loaderContext, args);
  if (isSync) {
    runCallback(null, result)
  }
}

function runLoaders(options, finalCallback) {
  const {
    resource,
    loaders = [],
    context = {},
    readResource = fs.readFile.bind(fs)
  } = options;
  let loaderContext = context;
  let loaderObjects = loaders.map(createLoaderObject)
  loaderContext.resourcePath = resource;
  loaderContext.readResource = readResource;
  loaderContext.loaders = loaderObjects;
  loaderContext.loaderIndex = 0; // 当前正在执行loader索引
  loaderContext.callback = null; // 调用此方法表示结束当前的loader，把结果传给下一个loader
  loaderContext.async = null; // 表示把loader的执行从同步变成异步
  Object.defineProperty(loaderContext, 'request', {
    get() {
      return loaderContext
      .loaders.map(loader => loader.path)
      .concat(resource)
      .join('!')
    }
  })
  Object.defineProperty(loaderContext, 'remainingRequest', {
    get() {
      return loaderContext
      .loaders.slice(loaderContext.loaderIndex + 1)
      .map(loader => loader.path)
      .concat(resource)
      .join('!')
    }
  })
  Object.defineProperty(loaderContext, 'currentRequest', {
    get() {
      return loaderContext
      .loaders.slice(loaderContext.loaderIndex)
      .map(loader => loader.path)
      .concat(resource)
      .join('!')
    }
  })
  Object.defineProperty(loaderContext, 'previousRequest', {
    get() {
      return loaderContext
      .loaders.slice(0, loaderContext.loaderIndex)
      .map(loader => loader.path)
      .join('!')
    }
  })
  Object.defineProperty(loaderContext, 'data', {
    get() {
      return loaderContext.loaders[loaderContext.loaderIndex].data
    }
  })
  // 处理的选项
  let processOptions = {
    resourceBuffer: null, // 读取到的源文件Buffer内容，要加载的文件的原始内容，转换前的内容
    readResource
  }
  iteratePitchingLoader(processOptions, loaderContext, (err, result) => {
    finalCallback(err, {
        result,
        resourceBuffer: processOptions.resourceBuffer
    })
  })
}

module.exports = {
  runLoaders
}