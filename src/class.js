/**
 * The basic Class unit
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Class = function() {
  var args = $A(arguments), properties = args.pop() || {}, parent = args.pop();
  
  // if only the parent class has been specified
  if (arguments.length == 1 && typeof(properties) == 'function') {
    parent = properties;
    properties = {};
  }
  
  // basic class object definition
  var klass = function() {
    return this.initialize ? this.initialize.apply(this, arguments) : this;
  };
  
  // the main class-level methods
  Object.extend(klass, {
    /**
     * this method will extend the class-level with the given objects
     *
     * NOTE: this method _WILL_OVERWRITE_ the existing itercecting entries
     *
     * NOTE: this method _WILL_NOT_OVERWRITE_ the class prototype and
     *       the class 'name' and 'parent' attributes. If one of those
     *       exists in one of the received modeuls, the attribute will be
     *       skipped
     *
     * @param Object module to extend
     * ....
     * @return Class the klass
     */
    extend: function() {
      var filter = ['prototype', 'name', 'parent', 'extend', 'include'];
      for (var i=0; i < arguments.length; i++) {
        if (arguments[i] instanceof Object) {
          for (var key in arguments[i]) {
            if (!filter.includes(key)) {
              this[key] = arguments[i][key];
            }
          }
        }
      }
      return this;
    },
    
    /**
     * extends the class prototype with the given objects
     * NOTE: this method _WILL_OVERWRITE_ the existing itercecting entries
     * NOTE: this method _WILL_NOT_OVERWRITE_ the 'klass' attribute of the klass.prototype
     *
     * @param Object module to include
     * ....
     * @return Class the klass
     */
    include: function() {
      for (var i=0; i < arguments.length; i++) {
        if (arguments[i] instanceof Object) {
          for (var key in arguments[i]) {
            if (key != 'klass') {
              if (this.parent && typeof(arguments[i][key])=='function') {
                // handling the parent class method call
                (function(name, func) {
                  this.prototype[name] = function() {
                    // sets the pointer to the superclass method each time you call the method
                    this.super = typeof(this.constructor.parent.prototype[name]) == 'function' ?
                      this.constructor.parent.prototype[name] : undefined;
                    
                    return func.apply(this, arguments);
                  };
                }).apply(this, [key, arguments[i][key]]);
              } else {
                this.prototype[key] = arguments[i][key];
              }
            }
          }
        }
      }
      return this;
    }
  });
  
  // handling the parent class assign
  if (parent && defined(parent.prototype)) {  
    klass.parent = parent;
    var s_klass = function() {};
    s_klass.prototype = parent.prototype;
    klass.prototype = new s_klass;
  }
  klass.prototype.constructor = klass;
  
  // handling the inline extendings
  if (properties['extend']) {
    var extends = properties['extend'];
    if (!(extends instanceof Array)) {
      extends = [extends];
    }
    klass.extend.apply(klass, extends);
    properties = Object.without(properties, 'extend');
  }
  
  // handling the inline includes
  if (properties['include']) {
    var includes = properties['include'];
    if (!(includes instanceof Array)) {
      includes = [includes];
    }
    klass.include.apply(klass, includes);
    properties = Object.without(properties, 'include');
  }
  
  // including the default definitions 
  klass.include(properties);
  
  return klass;
};