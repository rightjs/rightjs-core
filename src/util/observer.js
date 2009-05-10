/**
 * standard Observer class. 
 *
 * Might be used as a usual class or as a builder over another objects
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var Observer = new Class({
  /**
   * general constructor
   *
   * @param Object options
   */
  initialize: function(options) {
    Observer.create(this, options);
  },
  
  extend: {
    /**
     * class level builder. used to make another objects observable
     *
     * USAGE:
     *  var Something = new Class({....});
     *  Observer.create(Something.prototype);
     *
     *  var unit = new Something();
     *  unit.observe('foo', function() { return foo; });
     *  unit.fire('foo');
     *
     * OPTIONS:
     *   wire - method to be called when a callback get wired
     *   stop - method to be called when a callback get removed
     *   wrap - method to preprocess callacks if necessary
     *   shorts - a list of method names for which you need shortcuts
     *
     * @param Object object to extend
     * @param Object options
     * @return Object extened object
     */
    create: function(object, options) {
      $ext(object, this.Methods);
      
      object._oO = options || {};
      this.createShortcuts(object, object._oO['shorts'] || []);
      
      return object;
    },
    
    /**
     * builds shortcut methods to wire/fire events on the object
     *
     * @param Object object to extend
     * @param Array list of event names
     * @return Object extended object
     */
    createShortcuts: function(object, names) {
      names.each(function(name) {
        var shortcuts = {}, name = name.replace(/:/g, '_').toLowerCase().camelize();
        shortcuts[name] = function() {
          return this.fire.apply(this, [name].concat($A(arguments)));
        };
        shortcuts['on'+name.capitalize()] = function(callback) {
          if (isString(callback)) {
            var args = $A(arguments), method = args.shift();
            callback = (function() {
              this[method].apply(this, args);
            }).bind(this);
          }
          return this.observe(name, callback);
        };
        $ext(object, shortcuts, true);
      });
      
      return object;
    },

    
    // list of the standard observer methods
    Methods: {
      /**
       * wires the callback to observe the name
       *
       * @param String event name or a Hash {name: callback,...}
       * @param Function callback
       * @return Observer self
       */
      observe: function(name, callback) {
        if (isHash(name)) {
          for (var key in name) {
            this.observe(key, name[key]);
          }
        } else {
          var callback = this._oReg(name, callback), name = Event.cleanName(name);
          if (this._oO['wire']) this._oO['wire'].call(this, name, callback);
        }

        return this;
      },

      /**
       * checks if the object observes the event
       *
       * @param String event name or a hash {name: callback,...}
       * @param Function optional callback to check if the exact function is scheduled
       * @return Boolean result
       */
      observes: function(name, callback) {
        var result = true;

        if (isHash(name)) {
          for (var key in name) {
            result = !!(result & this.observes(key, name[key]));
          }
        } else {
          result = !!this._oCached(name, callback).length; // method returns an array
        }

        return result;
      },

      /**
       * detach the event observing
       *
       * NOTE: if no callback specified, all the registered callback will be detached
       *
       * @param String event name
       * @param Function optional
       * @return Observer self
       */
      stopObserving: function(name, callback) {
        if (this._oO['stop']) {
          var name = Event.cleanName(name);
          this._oCached(name, callback).each(function(callback) {
            this._oO['stop'].call(this, name, callback);
          }, this);
        }
          
        return this.cleanCache(name, callback);
      },

      /**
       * performs the event fire
       *
       * @param String event name
       * @param Object event options
       * @return Observer self
       */
      fire: function(name, options) {
        var event = new Event(name, options);
        this._oCached(name).walk('call', this, event);
        return this;
      },
      
      /**
       * returns the event listeners list
       *
       * @param String event name
       * @return Array event listeners
       */
      listeners: function(name) {
        var result = [], name = Event.cleanName(name);
        if (this._oCache && this._oCache[name]) {
          result = this._oCache[name].map(function(pair) { return pair['orig']; });
        }
        return result;
      },
      
    // protected

      /**
       * cleans the observers cache
       *
       * NOTE: if no name specified, all the scheduled callbacks will be removed
       *       if no callback specified, all the scheduled callbacks for the event
       *       name will be removed
       *
       * @param String name
       * @param Function callback
       * @return Observer self
       */
      cleanCache: function(name, callback) {
        var name = Event.cleanName(name);
        if (this._oCache && this._oCache[name]) {
          this._oCache[name] = callback ? this._oCache[name].filter(function(pair) {
            return callback != pair.orig;
          }) : [];
        }
        return this;
      },
      
      /**
       * registers the callback in the system
       *
       * NOTE: the cache object keeps not just a list of callbacks
       *       but pair of callbacks and their wraps, so we could fake them.
       *
       * @param String name
       * @param Function callback to register
       * @return Function wrapped callback
       */
      _oReg: function(name, callback) {
        var name = Event.cleanName(name), wrap = this._oO['wrap'] ? this._oO['wrap'].call(this, name, callback) : callback;
        
        this._oCache = this._oCache || {};
        this._oCache[name] = this._oCache[name] || [];
        this._oCache[name].push({ orig: callback, wrap: wrap });
        
        return wrap;
      },
      
      /**
       * tries to find registered callback for the event/callback pair
       *
       * NOTE: this method always return a list. if there's nothing
       *       registered for the name/function pair the list will be empty.
       *
       *       the result list will contain the wrapped versions of the
       *       callbacks. so if you used a custom wrapper over your callbacks
       *       then the method will return the wraps not the originals.
       *
       * @param String name
       * @param Function original callback
       * @return Array of registrered callbacks
       */
      _oCached: function(name, callback) {
        var result = [], name = Event.cleanName(name);
        if (this._oCache && this._oCache[name]) {
          this._oCache[name].each(function(pair) {
            if (!callback || callback == pair.orig)
              result.push(pair.wrap);
          });
        }
        return result;
      }
    }
  }
});