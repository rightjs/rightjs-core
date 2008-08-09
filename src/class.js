/**
 * The basic Class unit
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Class = function() {
  var args = $A(arguments), props = args.pop() || {}, parent = args.pop();
  
  // if only the parent class has been specified
  if (arguments.length == 1 && typeof(props) == 'function') {
    parent = props;
    props = {};
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
            if (!filter.include(key)) {
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
              this.prototype[key] = arguments[i][key];
            }
          }
        }
      }
      return this;
    }
  });
  
  klass.prototype.constructor = klass;
  klass.parent = parent;
  
  klass.include(props);
  
  return klass;
};