/**
 * DOM Element events handling methods
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Element.Methods, {
  /**
   * initiates an event observing
   *
   * @param String event name or events hash
   * @param Function to observe
   * @return Element self
   */
  observe: function(what, callback) {
    if (isHash(what)) {
      for (var key in what) {
        this.observe(key, what[key]);
      }
    } else {
      var what = this._what(what);
      this.addEventListener(what, this._callback(what, callback), false);
    }
    
    return this;
  },
  
  /**
   * checks if the element observes the event
   * optionally if it observes the event with the callback
   *
   * NOTE: works only if the event was wired with the 'watch' method
   *
   * NOTE: if a hash of events specified, then _all_ of the will be checked
   *
   * @params String event name or events hash
   * @param Function to observe (optional)
   * @return Boolean check result
   */
  observes: function(what, callback) {
    var result = true;
        
    if (isHash(what)) {
      for (var key in what) {
        result = !!(result & this.observes(key, what[key]));
      }
    } else {
      result = this._cached(this._what(what), callback) !== false;
    }
    
    return result;
  },
  
  /**
   * removes the event observer 
   *
   * @param String event name (with or without the 'on' prefix)
   * @param Function to observe
   * @return Element self
   */
  stopObserving: function(what, callback) {
    var what = this._what(what), wrap = this._cached(what, callback);
    
    if (callback) {
      this.removeEventListener(what, wrap, false);
    } else {
      var cache = this._eventsCache[what] || [];
      for (var i=0; i < cache.length; i++) {
        this.removeEventListener(what, cache[i].wrap, false);
      }
    }
    
    return this.cleanCache(what, callback);
  },
  
  /**
   * fires an event on the element
   *
   * @param String event name
   * @param Object optional event options
   * @return Event fired event
   */
  fire: function(name, options) {
    var event = new Event(name, options);
    if (document.createEvent) {
      this.dispatchEvent(event);
    } else {
      this.fireEvent(event.eventType, event);
    }
    return this;
  },
    
  /**
   * cleans the events cache
   *
   * @param String optional event name
   * @param Function optional callback function
   * @return void
   */
  cleanCache: function(what, callback) {
    this._eventsCache = this._eventsCache || {};
    if (what) {
      var clean = [];
      if (callback) {
        for (var i=0; i < this._eventsCache[what].length; i++) {
          if (this._eventsCache[what][i].orig != callback) {
            clean.push(this._eventsCache[what][i]);
          }
        }
      }
      this._eventsCache[what] = clean;
    } else {
      this._eventsCache = {};
    }
    return this;
  },
  
// protected
  /**
   * normalizes the event name string
   *
   * @param String dirty event name
   * @return String clean event name
   */
  _what: function(what) {
    what = Event.cleanName(what);
    if (what == 'mousewheel' && Browser.Gecko) {
      what = 'DOMMouseScroll';
    }
    return what;
  },
  
  /**
   * registers the callback in the internal cache, so it could be handled later
   *
   * @param String event name
   * @param Function callback function
   * @return void
   */ 
  _callback: function(what, callback) {
    var wrap = (function(callback) {
      return function() {
        Event.ext(arguments[0]);
        return callback.apply(this, arguments);
      };
    })(callback);
    
    if (Browser.IE) wrap = wrap.bind(this);
    
    this._eventsCache       = this._eventsCache       || {};
    this._eventsCache[what] = this._eventsCache[what] || [];
    this._eventsCache[what].push({orig: callback, wrap: wrap});
    
    return wrap;
  },
  
  // checks if there is a cache for the event/callback
  _cached: function(what, callback) {
    this._eventsCache = this._eventsCache || {};
    if (defined(this._eventsCache[what]) && this._eventsCache[what].length) {
      if (isFunction(callback)) {
        for (var i=0; i < this._eventsCache[what].length; i++) {
          if (this._eventsCache[what][i].orig == callback) {
            return this._eventsCache[what][i].wrap;
          }
        }
        return false;
      }
    } else {
      return false;
    }
    return null;
  }
  
});

/**
 * adding correctly looking vitual methods for IE browsers
 */
if (!Element.prototype.addEventListener) {
  $ext(Element.Methods, {
    addEventListener: function(what, callback) {
      this.attachEvent('on'+ what, callback);
    },
    
    removeEventListener: function(what, callback) {
      this.detachEvent('on'+ what, callback);
    }
  });
};

/**
 * creating shortcuts for the native events
 *
 */
(Element.Methods.NATIVE_EVENTS = Event.Mouse.prototype.NAMES.concat(Event.Keyboard.prototype.NAMES)).each(function(name) {
  // creates events firing methods like element.click();
  Element.Methods[name] = function(options) {
    return this.fire(name, options);
  };
  // creates events assignment methods like element.onClick(function(){});
  Element.Methods['on'+name.capitalize()] = function(callback) {
    return this.observe(name, callback);
  };
});

