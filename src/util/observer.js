/**
 * standard Observer class. 
 *
 * Might be used as a usual class or as a builder over another objects
 *
 * Credits:
 *   The naming principle is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var Observer = new Class({
  include: Options,
  
  /**
   * general constructor
   *
   * @param Object options
   */
  initialize: function(options) {
    this.setOptions(options);    
    Observer.createShortcuts(this, Class.findSet(this, 'events'));
  },
  
  /**
   * binds an event listener
   *
   * USAGE:
   *  on(String event, Function callback[, arguments, ...]);
   *  on(String event, String method_name[, arguments, ...]);
   *  on(Object events_hash);
   *
   * @return Observer self
   */
  on: function() {
    var args = $A(arguments), event = args.shift();
    
    if (isString(event)) {
      if (!defined(this.$listeners)) this.$listeners = [];

      var callback = args.shift(), name;
      switch (typeof callback) {
        case "string":
          name     = callback;
          callback = this[callback];

        case "function":
          var hash = {};
          
          // DON'T move it in the one-line hash variable definition,
          // it causes problems with the Konqueror 3 later on
          hash.e = event;
          hash.f = callback;
          hash.a = args;
          hash.r = name;
          
          this.$listeners.push(hash);
          break;

        default:
          if (isArray(callback)) {
            callback.each(function(params) {
              this.observe.apply(this, [event].concat(
                isArray(params) ? params : [params]
              ).concat(args));
            }, this);
          }
      }
      
    } else {
      // assuming it's a hash of key-value pairs
      for (var name in event) {
        this.observe.apply(this, [name].concat(
          isArray(event[name]) ? event[name] : [event[name]]
        ).concat(args));
      }
    }
    
    
    
    return this;
  },
  
  /**
   * checks if the observer observes given event and/or callback
   *
   * USAGE:
   *   observes(String event)
   *   observes(Function callback)
   *   observes(String event, Function callback)
   *
   * @retun boolean check result
   */
  observes: function(event, callback) {
    if (this.$listeners) {
      if (!isString(event)) { callback = event; event = null; }
      if (isString(callback)) callback = this[callback];
      
      return this.$listeners.some(function(i) {
        return (event && callback) ? i.e == event && i.f == callback :
          event ? i.e == event : i.f == callback;
      });
    }
    
    return false;
  },
  
  /**
   * stops observing an event or/and function
   *
   * USAGE:
   *   stopObserving(String event)
   *   stopObserving(Function callback)
   *   stopObserving(String event, Function callback)
   *
   * @return Observer self
   */
  stopObserving: function(event, callback) {
    if (this.$listeners) {
      if (!isString(event)) { callback = event; event = null; }
      if (isString(callback)) callback = this[callback];
      
      this.$listeners = this.$listeners.filter(function(i) {
        return (event && callback) ? (i.e !== event || i.f !== callback) :
          (event ? i.e !== event : i.f !== callback);
      }, this);
    }
    
    return this;
  },
  
  /**
   * returns the listeners list for the event
   *
   * NOTE: if no event was specified the method will return _all_
   *       event listeners for _all_ the events
   *
   * @param String event name
   * @return Array of listeners
   */
  listeners: function(event) {
    return (this.$listeners || []).filter(function(i) {
      return !event || i.e === event;
    }).map(function(i) { return i.f; }).uniq();
  },
  
  /**
   * initiates the event handling
   *
   * @param String event name
   * @param mixed optional argument
   * ........
   * @return Observer self
   */
  fire: function() {
    var args = $A(arguments), event = args.shift();
    
    (this.$listeners || []).each(function(i) {
      if (i.e === event) i.f.apply(this, i.a.concat(args));
    }, this);
    
    return this;
  },
  
  extend: {
    /**
     * adds an observer functionality to any object
     *
     * @param Object object
     * @param Array optional events list to build shortcuts
     * @return Object extended object
     */
    create: function(object, events) {
      $ext(object, Object.without(this.prototype, 'initialize', 'setOptions'), true);
      return this.createShortcuts(object, events || Class.findSet(object, 'events'));
    },
    
    /**
     * builds shortcut methods to wire/fire events on the object
     *
     * @param Object object to extend
     * @param Array list of event names
     * @return Object extended object
     */
    createShortcuts: function(object, names) {
      (names || []).each(function(name) {
        var shortcuts = {}, method_name = name.replace(/:/g, '_').camelize();
        shortcuts[method_name] = function() {
          return this.fire.apply(this, [name].concat($A(arguments)));
        };
        shortcuts['on'+method_name.capitalize()] = function() {
          return this.on.apply(this, [name].concat($A(arguments)));
        };
        $ext(object, shortcuts, true);
      });
      
      return object;
    }
  }
});

$alias(Observer.prototype, { observe: 'on' });