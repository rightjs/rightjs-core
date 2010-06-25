/**
 * The safe-mode layout
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var RightJS = (function(src) {
  // premassaging the source code, swapping the document reference where needed
  src = src
    // making it search in this document by default
    .replace(/(\.\$=.+?\{.+?)([a-z]+)(\.getElementById.+?\})/,  '$1parent.document$3')
    .replace(/(\.\$\$=.+?\{.+?)([a-z]+)(\.querySelector.+?\})/, '$1parent.document$3')
    .replace(/(\.\$\$=[^{}]+?\{[^}]+?\()(document)(,[^}]+?\})/, '$1parent.document$3');
  
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
  
  // loads up the native class extensions in the current window
  proxy.civilize = function() {
    for (var i=0, klass; i < natives.length; i++) {
      R_Klass = RightJS[natives[i]];
      W_Klass = window[natives[i]];
      
      if ('include' in R_Klass) {
        W_Klass.include = function(modules, dont_overwrite) {
          RightJS.$ext(this.prototype, modules, dont_overwrite);
        };
        
        if ('Methods' in R_Klass) {
          W_Klass.include(R_Klass.Methods);
        }
      }
    }
  };
  
  return RightJS.$ext(proxy, RightJS);
  
})(#{source_code});