/**
 * DOM Element events handling methods
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
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
      result = this._cached(what, callback);
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
    var what = this._what(what);
    if (callback) {
      this.removeEventListener(what, callback, false);
    } else {
      var cache = this._eventsCache[what] || [];
      for (var i=0; i < cache.length; i++) {
        this.removeEventListener(what, cache[i], false);
      }
    }
    
    return this.cleanCache(what, isFunction(callback) ? callback : null);
  },
  
  /**
   * cleans the events cache
   *
   * @param String optional event name
   * @param Function optional callback function
   * @return void
   */
  cleanCache: function(what, callback) {
    if (what) {
      this._eventsCache[what] = callback ? this._eventsCache[what].without(callback) : [];
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
    what = what.toLowerCase();
    if (what.startsWith('on')) {
      what = what.substr(2, what.length);
    }
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
    this._eventsCache[what] = this._eventsCache[what] || [];
    this._eventsCache[what].push(callback);
    return callback;
  },
  _eventsCache: {},
  
  // checks if there is a cache for the event/callback
  _cached: function(what, callback) {
    var what = this._what(what);
    if (defined(this._eventsCache[what]) && this._eventsCache[what].length) {
      if (isFunction(callback)) {
        for (var i=0; i < this._eventsCache[what].length; i++) {
          if (this._eventsCache[what][i] == callback) {
            return true;
          }
        }
        return false;
      }
    } else {
      return false;
    }
    return true;
  }
  
});

/**
 * adding correctly looking vitual methods for IE browsers
 */
if (!Element.prototype.addEventListener) {
  $ext(Element.Methods, {
    addEventListener: function(what, callback, captive) {
      this.attachEvent('on'+ what, callback);
    },
    
    removeEventListener: function(what, callback, captive) {
      this.detachEvent('on'+ what, callback);
    }
  });
};
