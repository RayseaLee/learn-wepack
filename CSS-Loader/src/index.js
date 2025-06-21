const moduleCss = require('./modules.css');
console.log(moduleCss);
const div = document.createElement('div');
div.className = moduleCss.locals.background;
document.body.appendChild(div);
