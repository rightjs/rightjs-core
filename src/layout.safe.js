/**
 * The safe-mode layout
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var RightJS = (function(src) {
  
  // building the frame sandbox
  var frame_id = '__rightjs_condom', window = self, document = window.document;
  if ('attachEvent' in window) {
    document.write('<iframe name="'+ frame_id +'" style="display:none"></iframe>');
  } else {
    var frame  = document.createElement('iframe');
    frame.name = frame_id;
    frame.style.display = 'none';
    document.documentElement.appendChild(frame);
  }
  
  // puttin the code into the frame
  var win = window.frames[frame_id];
  var doc = win.document;
  
  doc.open();
  doc.write('<html><head><script>'+ src +'</script></head></html>');
  doc.close();
  
  // transferring the object references from the sandbox into local variable
  var RightJS = win.RightJS;
  var natives = ['String', 'Array', 'Function', 'Math', 'Number', 'Object', 'RegExp', 'Date'];
  for (var i=0; i < natives.length; i++) {
    RightJS[natives[i]] = win[natives[i]];
  }
  
  // building the access proxy
  var proxy = function(value) {
    switch (typeof value) {
      case 'number':   return new RightJS.Number(value);
      case 'string':   return new RightJS.String(value);
      case 'function': return RightJS.$ext(value, RightJS.Function.Methods);
      case 'object':
        if (RightJS.isArray(value))
          return RightJS.$A(value);
    }
    
    return value;
  };
  
  // loads up the native class extensions
  proxy.civilize = function() {
    for (var i=0; i < natives.length; i++) {
      if ('include' in natives[i]) {
        window[natives[i]].include = natives[i].include;
        if ('Methods' in natives[i]) {
          window[natives[i]].include(natives[i].Methods);
        }
      }
    }
  };
  
  
  return RightJS.$ext(proxy, RightJS);
  
})(#{source_code});