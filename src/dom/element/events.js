/**
 * DOM Element events handling methods
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
/*
Element.addMethods(
  Observer.create({}, {
    
    // additional callback for events attachment
    wire: function(name, callback) {
      var name = Event.realName(name);
      if (this.addEventListener) {
        this.addEventListener(name, callback, false);
      } else {
        this.attachEvent('on'+ name, callback);
      }
    },
    
    // additional callback on events removing
    stop: function(name, callback) {
      var name = Event.realName(name);
      if (this.removeEventListener) {
        this.removeEventListener(name, callback, false);
      } else {
        this.detachEvent('on'+ name, callback);
      }
    },

    // event handlers wrapper
    wrap: function(name, callback) {
      var wrap = (function(callback) {
        return function() {
          Event.ext(arguments[0]);
          return callback.apply(this, arguments);
        };
      })(callback);

      if (Browser.IE) wrap = wrap.bind(this);

      return wrap;
    }
  })
);

*/