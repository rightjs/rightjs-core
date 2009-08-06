/**
 * This module contains the methods by which the Class instances
 * will be extended. It provides basic and standard way to work
 * with the classes.
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Class.Methods = {
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
      if (isHash(arguments[i])) {
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
      if (isHash(arguments[i])) {
        for (var key in arguments[i]) {
          if (key != 'klass' && key != 'constructor') {
            
            // handling the super methods
            var ancestor = this.ancestors.first(function(klass) { return isFunction(klass.prototype[key]); });
            
            if (ancestor) {
              (function(name, method, $super) {
                this.prototype[name] = function() {
                  this.$super = $super;
                  
                  return method.apply(this, arguments);
                };
              }).call(this, key, arguments[i][key], ancestor.prototype[key]);
            } else {
              this.prototype[key] = arguments[i][key];
            }
            
          }
        }
      }
    }
    return this;
  }
};