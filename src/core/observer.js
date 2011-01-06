/**
 * standard Observer class.
 *
 * Might be used as a usual class or as a builder over another objects
 *
 * Credits:
 *   The naming principle is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
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
    Observer_on(this, arguments, function(h) { return h; });
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
    if (isString(callback)) { callback = callback in this ? this[callback] : null; }

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
    Observer_stopObserving(this, event, callback, function() {});
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
  $ext(object, Object.without(Observer.prototype, 'initialize', 'setOptions'), true);
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

function Observer_on(object, o_args, preprocess) {
  var args     = slice.call(o_args, 2),
      event    = o_args[0],
      callback = o_args[1],
      name     = false;

  if (isString(event)) {
    switch (typeof callback) {
      case "string":
        name     = callback;
        callback = callback in object ? object[callback] : function() {};

      case "function":
        ('$listeners' in object ? object.$listeners : (
          object.$listeners = []
        )).push(preprocess({
          e: event, f: callback, a: args, r: name, t: object
        }));
        break;

      default:
        if (isArray(callback)) {
          for (var i=0; i < callback.length; i++) {
            object.on.apply(object, [event].concat(
              ensure_array(callback[i])
            ).concat(args));
          }
        }
    }

  } else {
    // assuming it's a hash of key-value pairs
    args = slice.call(o_args, 1);

    for (name in event) {
      object.on.apply(object, [name].concat(
        ensure_array(event[name])
      ).concat(args));
    }
  }
}

function Observer_stopObserving(object, event, callback, preprocess) {
  if (isHash(event)) {
    for (var key in event) {
      object.stopObserving(key, event[key]);
    }
  } else {
    if (!isString(event)) {  callback = event; event = null; }
    if (isString(callback)){ callback = object[callback]; }

    object.$listeners = (object.$listeners || []).filter(function(i) {
      var result = (event && callback) ?
        (i.e !== event || i.f !== callback) :
        (event ? i.e !== event : i.f !== callback);

      if (!result) { preprocess(i); }

      return result;
    });
  }
}
