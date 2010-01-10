/**
 * DOM Element events handling methods
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Element.include((function() {
  var observer = Observer.create({}, 
    $w('click rightclick contextmenu mousedown mouseup mouseover mouseout mousemove keypress keydown keyup')
  );
  
  //
  // HACK HACK HACK
  //
  // I'm kinda patching the observer methods manually in here
  // the reason is in building flat and fast functions
  //
  observer.observe = observer.on = eval('({f:'+
    observer.observe.toString().replace(/(\$listeners\.push\((\w+?)\);)/, '$1'+
      '$2.e=Event.cleanName($2.e);$2.n=Event.realName($2.e);'+
      
      '$2.w=function(){var a=$A(arguments),e=($2.r&&$2.r!=="stopEvent")?a.shift():Event.ext(a[0],this);'+
        'return $2.f.apply(this,a.concat($2.a))};'+(
      
      self.attachEvent ?
        '$2.w=$2.w.bind(this);this.attachEvent("on"+$2.n,$2.w);' :
        'this.addEventListener($2.n,$2.w,false);'
      )
    )+
  '})').f;
  
  observer.stopObserving = eval('({f:'+
    observer.stopObserving.toString().replace(/(function\s*\((\w+)\)\s*\{\s*)(return\s*)([^}]+)/m, 
      '$1var r=$4;'+
      'if(!r)' + (self.attachEvent ? 
        'this.detachEvent("on"+$2.n,$2.w);' :
        'this.removeEventListener($2.n,$2.w,false);'
      )+'$3 r')+
  '})').f;
  
  
  observer.fire = eval('({f:'+
    observer.fire.toString().replace(/(\w+)\.f\.apply.*?\.concat\((\w+)\)[^}]/,
      '$1.f.apply(this,[new Event($1.e,$2.shift())].concat($1.a).concat($2))'
    )+
  '})').f;
  
  // a simple events terminator method to be hooked like
  // this.onClick('stopEvent');
  observer.stopEvent = function(e) { e.stop(); };
  
  $ext(window,   observer);
  $ext(document, observer);
  
  return observer;
})());
