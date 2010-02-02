var scripts = [
  'right',
  
  'core/browser',
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
  
  'util/options',
  'util/observer',
  'util/break',
  'util/cookie',
  
  'dom/event',
  'dom/event/custom',
  'dom/event/delegation',
  
  'dom/element',
  'dom/element/structs',
  'dom/element/styles',
  'dom/element/commons',
  'dom/element/dimensions',
  'dom/element/events',
  
  'dom/selector',
  
  'dom/form',
  'dom/form/element',
  
  'dom/window',
  'dom/ready',
  
  'xhr/xhr',
  'xhr/form',
  'xhr/element',
  'xhr/iframed',
  
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

