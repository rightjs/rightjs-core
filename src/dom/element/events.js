/**
 * DOM Element events handling methods
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Element_observer = Observer.create({}, 
  String_addShorts($w('click rightclick contextmenu mousedown mouseup mouseover mouseout mousemove keypress keydown keyup'))
), attach = 'attachEvent' in window, REvent = 'RightJS.Event';

//
// HACK HACK HACK
//
// I'm kinda patching the observer methods manually in here
// the reason is in building flat and fast functions
//
function hack_observer(name, re, text) {
  Element_observer[name] = eval('['+ Element_observer[name].toString().replace(re, text) +']')[0];
};

hack_observer('on', 
  /(\$listeners\.push\((\w+?)\);)/,
  
  '$1$2.e='+ REvent +'.cleanName($2.e);$2.n='+ REvent +'.realName($2.e);'+
  
  '$2.w=function(){'+
    'var a=$A(arguments);$2.r&&$2.r!=="stopEvent"?a.shift():a[0]=new '+ REvent +'(a[0],this);'+
    '$2.f.apply($2.t,a.concat($2.a))};$2.t=this;' + (
      attach ?
        'this._.attachEvent("on"+$2.n,$2.w);' :
        'this._.addEventListener($2.n,$2.w,false);'
      )
);

hack_observer('stopObserving',
  /(function\s*\((\w+)\)\s*\{\s*)(return\s*)([^}]+)/m, 
  '$1var r=$4;'+
  'if(!r)' + (attach ? 
    'this._.detachEvent("on"+$2.n,$2.w);' :
    'this._.removeEventListener($2.n,$2.w,false);'
  )+'$3 r'
);

hack_observer('fire',
  /(\w+)\.f\.apply.*?\.concat\((\w+)\)\)/,
  '$1.f.apply(this,(($1.r&&$1.r!=="stopEvent")?[]:[new '+ REvent +'($1.e,$2.shift())]).concat($1.a).concat($2))'
);

// a simple events terminator method to be hooked like this.onClick('stopEvent');
Element_observer.stopEvent = function(e) { e.stop(); };

// loading the observer interface into the Element object
Element.include(Element_observer);
Document.include(Element_observer);
Window.include(Element_observer);

// couple more shortcuts for the window
Observer.createShortcuts(Window[PROTO], $w('blur focus scroll resize'));
