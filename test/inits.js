var scripts = [
  'right.js',
  
  'core/browser.js',
  'core/util.js',
  
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
  
  'util/options.js',
  'util/observer.js',
  'util/break.js',
  'util/cookie.js',
  
  'dom/event.js',
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
  'dom/selector/multiple.js',
  
  'dom/form.js',
  'dom/form/element.js',
  
  'dom/window.js',
  'dom/ready.js',
  
  'xhr/xhr.js',
  'xhr/form.js',
  'xhr/element.js',
  'xhr/iframed.js',
  
  'fx/fx.js',
  'fx/array.js',
  'fx/string.js',
  'fx/fx/morph.js',
  'fx/fx/highlight.js',
  'fx/fx/twin.js',
  'fx/fx/slide.js',
  'fx/fx/fade.js',
  'fx/element.js',
  
  
  // old browser hacks
  'olds/core/ie.js'
];

for (var i=0; i < scripts.length; i++) {
  document.writeln('<scr'+'ipt type="text/javascript" src="../src/'+scripts[i]+'"></scr'+'ipt>');
}

