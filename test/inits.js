var scripts = [
  'core/util.js',
  'core/browser.js',
  'native/object.js',
  'native/math.js',
  'native/array.js',
  'native/string.js',
  'native/function.js',
  'native/number.js',
  'core/class.js',
  'core/class/util.js',
  'core/class/methods.js',
  'util/cookie.js',
  'util/break.js',
  'dom/element.js',
  'dom/element/styles.js',
  'dom/element/commons.js',
  'dom/element/structs.js',
  'dom/element/dimensions.js',
  'dom/element/events.js',
  'dom/event.js',
  'dom/event/base.js',
  'dom/event/mouse.js',
  'dom/event/keyboard.js',
  'dom/selector.js',
  'dom/selector/atom.js',
  'dom/selector/manual.js',
  'dom/selector/native.js',
  'dom/selector/multiple.js',
  'dom/extend.js'
];

for (var i=0; i < scripts.length; i++) {
  document.writeln('<scr'+'ipt type="text/javascript" src="../src/'+scripts[i]+'"></scr'+'ipt>');
}

