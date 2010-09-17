/**
 * standard Observer class.
 *
 * Might be used as a usual class or as a builder over another objects
 *
 * Credits:
 *   The naming principle is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Observer = RightJS.Observer = new Class({
  include: Options,

  /**
   * general constructor
   *
   * @param Object options
   */
  initialize: function(options) {
    this.setOptions(options);
    Observer_createShortcuts(this, Class_findSet(this, 'events'));
    return this;
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
    var args = $A(arguments), event = args.shift(), name;

    if (isString(event)) {
      if (!('$listeners' in this)) { this.$listeners = []; }

      var callback = args.shift();
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
            for (var i=0; i < callback.length; i++) {
              this.on.apply(this, [event].concat(
                ensure_array(callback[i])
              ).concat(args));
            }
          }
      }

    } else {
      // assuming it's a hash of key-value pairs
      for (name in event) {
        this.on.apply(this, [name].concat(
          ensure_array(event[name])
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
    if (!isString(event)) { callback = event; event = null; }
    if (isString(callback)) { callback = this[callback]; }

    return (this.$listeners || []).some(function(i) {
      return (event && callback) ? i.e === event && i.f === callback :
        event ? i.e === event : i.f === callback;
    });
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
    if (isHash(event)) {
      for (var key in event) {
        this.stopObserving(key, event[key]);
      }
    } else {
      if (!isString(event)) {  callback = event; event = null; }
      if (isString(callback)){ callback = this[callback]; }

      this.$listeners = (this.$listeners || []).filter(function(i) {
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
      if (i.e === event) {
        i.f.apply(this, i.a.concat(args));
      }
    }, this);

    return this;
  }
}),

/**
 * adds an observer functionality to any object
 *
 * @param Object object
 * @param Array optional events list to build shortcuts
 * @return Object extended object
 */
Observer_create = Observer.create =  function(object, events) {
  $ext(object, Object.without(Observer[PROTO], 'initialize', 'setOptions'), true);
  return Observer_createShortcuts(object, events || Class_findSet(object, 'events'));
},

/**
 * builds shortcut methods to wire/fire events on the object
 *
 * @param Object object to extend
 * @param Array list of event names
 * @return Object extended object
 */
Observer_createShortcuts = Observer.createShortcuts = function(object, names) {
  (names || []).each(function(name) {
    var method_name = 'on'+name.replace(/(^|_|:)([a-z])/g, function(match, pre, chr) { return chr.toUpperCase(); });
    if (!(method_name in object)) {
      object[method_name] = function() {
        return this.on.apply(this, [name].concat($A(arguments)));
      };
    }
  });

  return object;
};
