var scripts = [
  'right',
  
  'core/util',
  
  'lang/object',
  'lang/math',
  'lang/array',
  'lang/string',
  'lang/function',
  'lang/number',
  'lang/regexp',
  
  'core/class',
  'core/class/methods',
  
  'core/options',
  'core/observer',
  'core/break',
  
  'dom/browser',
  'dom/cookie',
  
  'dom/wrapper',
  
  'dom/event',
  'dom/event/custom',
  'dom/event/delegation',
  
  'dom/element',
  'dom/element/structs',
  'dom/element/styles',
  'dom/element/commons',
  'dom/element/dimensions',
  'dom/element/events',
  
  'dom/form',
  
  'dom/document',
  'dom/window',
  'dom/ready',
  
  'dom/selector',
  
  'xhr/xhr',
  'xhr/form',
  'xhr/element',
  'xhr/xhr/dummy',
  'xhr/xhr/iframed',
  'xhr/xhr/jsonp',
  
  'fx/fx',
  'fx/string',
  'fx/fx/morph',
  'fx/fx/highlight',
  'fx/fx/twin',
  'fx/fx/slide',
  'fx/fx/fade',
  'fx/fx/scroll',
  'fx/element',
  
  
  // old browser hacks
  'olds/ie',
  'olds/konq',
  'olds/css'
];

for (var i=0; i < scripts.length; i++) {
  document.writeln('<scr'+'ipt type="text/javascript" src="../src/'+scripts[i]+'.js"></scr'+'ipt>');
}

