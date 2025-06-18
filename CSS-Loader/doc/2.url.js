var cssLoaderGetUrlImport = __webpack_require__("./node_modules/css-loader/dist/runtime/getUrl.js");
var cssLoaderUrlImport0 = __webpack_require__("./loaders/css-loader&style-loader.png");
var cssLoaderUrlReplacement0 = cssLoaderGetUrlImport(cssLoaderUrlImport0);
___CSS_LOADER_EXPORT___.push([module.id, `body {
  color: red;
  background-image: url(${cssLoaderUrlReplacement0});
  background-repeat: no-repeat;
}`, ""]);

// 步骤：
// 1.导入getUrl.js
// 2.导入图片路径
// 3.调用getUrl方法，传入图片路径，拿到新的图片路径
// 4.替换url里的参数为新的图片路径