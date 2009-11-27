/**
 * This module contains the methods by which the Class instances
 * will be extended. It provides basic and standard way to work
 * with the classes.
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Class.Methods = {
  /**
   * Makes the class get inherited from another one
   *
   * @param Object another class
   * @return Class this
   */
  inherit: function(parent) {
    // handling the parent class assign
    if (parent && parent.prototype) {
      var s_klass = function() {};
      s_klass.prototype = parent.prototype;
      this.prototype = new s_klass;
      this.parent = parent;
    }

    // collecting the list of ancestors
    this.ancestors = [];
    while (parent) {
      this.ancestors.push(parent);
      parent = parent.parent;
    }
    
    return this.prototype.constructor = this;
  },
  
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
    $A(arguments).filter(isHash).each(function(module) {
      $ext(this, Object.without(module, 'prototype', 'parent', 'extend', 'include'));
    }, this);
    
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
    var ancestors = this.ancestors.map('prototype'), ancestor;
    
    $A(arguments).filter(isHash).each(function(module) {
      for (var key in module) {
        if (key != 'klass' && key != 'constructor') {
          
          // handling the super methods
          ancestor = ancestors.first(function(proto) { return isFunction(proto[key]); });
          
          if (ancestor) {
            (function(name, method, super_method) {
              this[name] = function() {
                this.$super = super_method;
                
                return method.apply(this, arguments);
              };
            }).call(this, key, module[key], ancestor[key]);
          } else {
            this[key] = module[key];
          }
          
        }
      }
    }, this.prototype);
    
    return this;
  }
};