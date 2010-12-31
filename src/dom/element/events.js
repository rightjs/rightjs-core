/**
 * DOM Element events handling methods
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var Element_observer = Observer_create({});

//
// HACK HACK HACK
//
// I'm kinda patching the observer methods manually in here
// the reason is in building flat and fast functions
//
function hack_observer(name, re, text) {
  Element_observer[name] = eval('['+ Element_observer[name].toString().replace(re, text) + ']')[0];
}

hack_observer('on',
  /(\$listeners\.push\((\w+?)\);)/,

  // aliasing the 'rightclick' to the 'contextmenu' event
  '$1$2.e=$2.n=$2.e==="rightclick"?"contextmenu":$2.e;'+

  // swapping a browser related event names
  (Browser.Gecko      ? 'if($2.e==="mousewheel")$2.n="DOMMouseScroll";' : '') +
  (Browser.Konqueror  ? 'if($2.e==="contextmenu")$2.n="rightclick";'    : '') +

  '$2.w=$2.e==="mouseenter"||$2.e==="mouseleave"?'+
    'function(){}:'  + // so IE didn't bother, coz we handle it in the mouseio module
  'function(e){'+
    'e=new RightJS.Event(e,this);'+
    '$2.f.apply($2.t,($2.r?[]:[e]).concat($2.a))===false&&e.stop()'+
  '};'+
  '$2.t=this;' +(
    looks_like_ie ?
      '$2.w=$2.w.bind(this);this._.attachEvent("on"+$2.n,$2.w);' :
      'this._.addEventListener($2.n,$2.w,false);'
  )
);

hack_observer('stopObserving',
  /(function\s*\((\w+)\)\s*\{\s*)(return\s*)([^}]+)/m,
  '$1var r=$4;'+
  'if(!r)this._.' + (looks_like_ie ?
    'detachEvent("on"+$2.n,$2.w);' :
    'removeEventListener($2.n,$2.w,false);'
  )+'$3 r'
);

// adding the event generator
hack_observer('fire',
  /(\w+)(\s*=\s*(\w+).shift\(\))/,
  '$1$2;$1=$1 instanceof RightJS.Event?$1:'+
  'new RightJS.Event($1,RightJS.Object.merge({target:this._},$3[0]));'+
  '$1.currentTarget=this'
);

// addjusting the arguments list
hack_observer('fire',
  /((\w+)\.e\s*===\s*(\w+))([^}]+\2\.f\.apply)[^}]+?\.concat\(\w+\)\)/,
  '$1.type$4(this,($2.r?[]:[$3]).concat($2.a))===false&&$1.stop()'
);

// makding the events bubble
hack_observer('fire',
  /(\w+)(\s*=\s*\w+\.shift[\s\S]+)(return this)/m,
  '$1$2var p=!$1.stopped&&this.parent&&this.parent();p&&p.fire&&p.fire($1);$3'
);

// a simple events terminator method to be hooked like this.onClick('stopEvent');
Element_observer.stopEvent = function() { return false; };

// loading the observer interface into the Element object
Element.include(Element_observer);
Document.include(Element_observer);
Window.include(Element_observer);

// couple more shortcuts for the window
Observer_createShortcuts(Window[PROTO], $w('blur focus scroll resize load'));

/**
 * Registers a list of event-binding shortcuts like
 *  $(element).onClick
 *  $(element).onMouseover
 *
 * @param String space separated event names
 * @return void
 */
function Element_add_event_shortcuts(tokens) {
  tokens = $w(tokens);
  Event_delegation_shortcuts = Event_delegation_shortcuts.concat(tokens);

  Observer_createShortcuts(Element[PROTO], tokens);
  Observer_createShortcuts(Document[PROTO], tokens);
}

Element_add_event_shortcuts(
  'click rightclick contextmenu mousedown mouseup mouseover mouseout mousemove keypress keydown keyup'
);
