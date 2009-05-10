var scripts = [
  'core/util.js',
  'core/browser.js',
  'lang/object.js',
  'lang/math.js',
  'lang/array.js',
  'lang/string.js',
  'lang/function.js',
  'lang/number.js',
  'lang/regexp.js',
  'core/class.js',
  'core/class/util.js',
  'core/class/methods.js',
  'util/observer.js',
  'util/cookie.js',
  'util/break.js',
  'dom/event.js',
  'dom/event/base.js',
  'dom/event/mouse.js',
  'dom/event/keyboard.js',
  'dom/event/custom.js',
  'dom/element.js',
  'dom/element/structs.js',
  'dom/element/styles.js',
  'dom/element/commons.js',
  'dom/element/dimensions.js',
  'dom/element/events.js',
  'dom/selector.js',
  'dom/selector/atom.js',
  'dom/selector/manual.js',
  'dom/selector/native.js',
  'dom/selector/multiple.js',
  'dom/form.js',
  'dom/form/element.js',
  'xhr/xhr.js',
  'xhr/element.js',
  'xhr/iframed.js'
];

for (var i=0; i < scripts.length; i++) {
  document.writeln('<scr'+'ipt type="text/javascript" src="../src/'+scripts[i]+'"></scr'+'ipt>');
}

