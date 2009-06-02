/**
 * standard Observer class. 
 *
 * Might be used as a usual class or as a builder over another objects
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
    if (!this.options.shorts) {
      var ancestor;
      this.options.shorts = this.EVENTS || this.constructor.EVENTS ||
        ((ancestor = this.constructor.ancestors.any('EVENTS')) ?
          ancestor.EVENTS : null);
    }
    
    Observer.createShortcuts(this, this.options.shorts);
    delete(this.options['shorts']);
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
    var args = $A(arguments), events = args.shift(), callback;
    if (!isHash(events)) { var hash = {}; hash[events] = args; events = hash; }
    
    if (!this.$listeners) this.$listeners = [];
    
    for (var name in events) {
      if (!isArray(events[name])) events[name] = [events[name]];
      callback = isString(events[name][0]) ? this[events[name][0]] : events[name][0];
      
      if (!this.observes(name, callback)) {
        this.$listeners.push({ e: name, f: callback, a: events[name].slice(1) });
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
      
      return !!this.$listeners.any(function(i) {
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
      
      this.$listeners = this.$listeners.filter(function(i) {
        return (event && callback) ? (i.e != event || i.f != callback) :
          (event ? i.e != event : i.f != callback);
      });
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
      if (i.e == event)
        i.f.apply(this, i.a.concat(args));
    }, this);
    
    return this;
  },
  
  extend: {    
    /**
     * builds shortcut methods to wire/fire events on the object
     *
     * @param Object object to extend
     * @param Array list of event names
     * @return Object extended object
     */
    createShortcuts: function(object, names) {
      (names || []).each(function(name) {
        var shortcuts = {}, name = name.replace(/:/g, '_').toLowerCase().camelize();
        shortcuts[name] = function() {
          return this.fire.apply(this, [name].concat($A(arguments)));
        };
        shortcuts['on'+name.capitalize()] = function() {
          return this.on.apply(this, [name].concat($A(arguments)));
        };
        $ext(object, shortcuts, true);
      });
      
      return object;
    }
  }
});

$alias(Observer.prototype, { observe: 'on' });