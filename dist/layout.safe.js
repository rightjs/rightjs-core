/**
 * The safe-mode layout
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var RightJS = (function(window, src) {
  // premassaging the source code, swapping the document reference where needed
  src = src
    // the default document to the current one
    .replace(',document,', ',parent.document,')
    
    // building the inside types conversion methods
    + 'RightJS.$N=function(v){return new Number(v)};'
    + 'RightJS.$S=function(v){return new String(v)}';
  
  // building the frame sandbox
  var frame_id = '__rightjs_condom', document = window.document;
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
  
  if ('execScript' in win) {
    win.execScript(src);
  } else {
    var doc = win.document;
    doc.open();doc.write('<html></html>'); doc.close();
    
    var script = document.createElement('script');
    script.text = src;
    doc.body.appendChild(script);
  }
  
  // transferring the object references from the sandbox into local variable
  var RightJS = win.RightJS;
  var natives = 'Number,String,Array,Function,Math,Object,RegExp,Date'.split(',');
  for (var i=0; i < natives.length; i++) {
    RightJS[natives[i]] = win[natives[i]];
  }
  RightJS.context = win;
  RightJS.safe    = true;
  
  // building the access and types conversion proxy
  var proxy = function(value) {
    switch (typeof value) {
      case 'number':   return RightJS.$N(value);
      case 'string':   return RightJS.$S(value);
      case 'function': return RightJS.$ext(value, RightJS.Function.Methods);
      case 'object':
        if (RightJS.isArray(value))
          return RightJS.$A(value);
    }
    
    return value;
  };
  
  return RightJS.$ext(proxy, RightJS);
  
})(window, %{source_code});