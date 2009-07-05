/**
 * DOM Element events handling methods
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Element.addMethods((function() {
  var observer = Observer.create({}, 
    $w('click rightclick mousedown mouseup mouseover mouseout mousemove keypress keydown keyup')
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
      
      if (Browser.IE) hash.w = hash.w.bind(this);
      
      if (this.addEventListener) {
        this.addEventListener(hash.n, hash.w, false);
      } else {
        this.attachEvent('on'+ hash.n, hash.w);
      }
    },
    
    remove: function(hash) {
      if (this.removeEventListener) {
        this.removeEventListener(hash.n, hash.w, false);
      } else {
        this.detachEvent('on'+ hash.n, hash.w);
      }
    }
  };
  
  observer.fire = function() {
    var args = $A(arguments), event = new Event(args.shift(), args.shift());
    
    (this.$listeners || []).each(function(i) {
      if (i.e == event.eventName) {
        i.f.apply(this, [event].concat(i.a).concat(args));
        if (event.stopped) $break();
      }
    }, this);
    
    return this;
  }
  
  $ext(window,   observer);
  $ext(document, observer);
  
  return observer;
})());
