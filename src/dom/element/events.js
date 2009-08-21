/**
 * DOM Element events handling methods
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Element.addMethods((function() {
  var observer = Observer.create({}, 
    $w('click rightclick contextmenu mousedown mouseup mouseover mouseout mousemove keypress keydown keyup')
  );
  
  observer.$o = {
    add: function(hash) {
      var callback = hash.f, args = hash.a;
      hash.e = Event.cleanName(hash.e);
      hash.n = Event.realName(hash.e);
      
      hash.w = function() {
        Event.ext(arguments[0]);
        return callback.apply(this, $A(arguments).concat(args));
      };
      
      if (this.addEventListener) {
        this.addEventListener(hash.n, hash.w, false);
      } else {
        hash.w = hash.w.bind(this);
        this.attachEvent('on'+ hash.n, hash.w);
      }
    },
    
    remove: function(hash) {
      if (this.removeEventListener) {
        this.removeEventListener(hash.n, hash.w, false);
      } else {
        this.detachEvent('on'+ hash.n, hash.w);
      }
    },
    
    fire: function(name, args, hash) {
      var event = new Event(name, args.shift());
      hash.f.apply(this, [event].concat(hash.a).concat(args));
    }
  };
  
  // a simple events terminator method to be hooked like
  // this.onClick('stopEvent');
  observer.stopEvent = function(e) { e.stop(); };
  
  $ext(window,   observer);
  $ext(document, observer);
  
  return observer;
})());
