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
    
    // catching up the event shortucts
    var ancestor, shorts = this.EVENTS || this.constructor.EVENTS ||
        ((ancestor = this.constructor.ancestors.first('EVENTS')) ?
          ancestor.EVENTS : null);
          
    Observer.createShortcuts(this, shorts);
  },
  
  /**
   * starts observing an event
   *
   * USAGE:
   *  observe(String event, Function callback[, arguments, ...]);
   *  observe(String event, String method_name[, arguments, ...]);
   *  observe(Object events_hash);
   *
   * @return Observer self
   */
  observe: function() {
    var args = $A(arguments), event = args.shift();
    
    if (!event.trim) { // <- not a string
      for (var name in event) {
        this.observe.apply(this, [name].concat(
          isArray(event[name]) ? event[name] : [event[name]]
        ).concat(args));
      }
    }
    
    if (!this.$listeners) this.$listeners = [];
    
    var callback = args.shift();
    switch (typeof callback) {
      case "string":
        callback = this[callback];
        
      case "function":
        var hash = { e: event, f: callback, a: args };
        this.$listeners.push(hash);
        
        if (this.$o && this.$o.add) this.$o.add.call(this, hash);
        
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
   * @retun Observer self
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
        var result = (event && callback) ? (i.e != event || i.f != callback) :
          (event ? i.e != event : i.f != callback);
        
        if (!result && this.$o && this.$o.remove) this.$o.remove.call(this, i);
        
        return result;
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
      return !event || i.e == event;
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
      if (i.e == event) {
        (this.$o && this.$o.fire) ? this.$o.fire.call(this, event, args, i)  :
          i.f.apply(this, i.a.concat(args));
      }
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
      return this.createShortcuts(object, events || object['EVENTS']);
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

$alias(Observer.prototype, { on: 'observe' });