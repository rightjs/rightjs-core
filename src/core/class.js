/**
 * The basic Class unit
 *
 * Credits:
 *   The Class unit is inspired by its implementation in
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Class = RightJS.Class = function() {
  var args = $A(arguments), properties = args.pop() || {},
    parent = args.pop(), prebind = 'prebind';
  
  // basic class object definition
  function klass() {
    if (prebind in this && isArray(this[prebind])) {
      this[prebind].each(function(method) {
        this[method] = this[method].bind(this);
      }, this);
    }
    
    return this.initialize ? this.initialize.apply(this, arguments) : this;
  };

  // if only the parent class has been specified
  if (!args.length && !isHash(properties)) {
    parent = properties; properties = {};
  }
  
  // attaching main class-level methods
  $ext(klass, Class_Methods).inherit(parent);
  
  // catching the injections
  $w('extend include').each(function(name) {
    if (properties[name]) {
      var modules = properties[name];
      klass[name].apply(klass, isArray(modules) ? modules : [modules]);
      delete(properties[name]);
    }
  });
  
  return klass.include(properties);
},

/**
 * Class utility methods
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
commons = $w('selfExtended self_extended selfIncluded self_included'),
extend  = commons.concat($w(PROTO+' parent extend include')),
include = commons.concat(['constructor']),
clean_module = function (module, what) {
  return Object.without.apply(Object, [module].concat(what == 'e' ? extend : include));
},

Class_Methods = {
  /**
   * Makes the class get inherited from another one
   *
   * @param Object another class
   * @return Class this
   */
  inherit: function(parent) {
    // handling the parent class assign
    if (parent && parent[PROTO]) {
      var s_klass = dummy();
      s_klass[PROTO] = parent[PROTO];
      this[PROTO] = new s_klass;
      this.parent = parent;
    }

    // collecting the list of ancestors
    this.ancestors = [];
    while (parent) {
      this.ancestors.push(parent);
      parent = parent.parent;
    }

    return this[PROTO].constructor = this;
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
      var callback = module.selfExtended || module.self_extended;
      
      $ext(this, clean_module(module, 'e'));
      
      if (callback) callback.call(module, this);
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
    var ancestors = (this.ancestors || []).map(PROTO), ancestor;

    $A(arguments).filter(isHash).each(function(module) {
      var callback = module.selfIncluded || module.self_included;
      module = clean_module(module, 'i');

      for (var key in module) {
        ancestor = ancestors.first(function(proto) { return key in proto && isFunction(proto[key]); });

        this[PROTO][key] = !ancestor ? module[key] :
          (function(name, method, super_method) {
            return function() {
              this.$super = super_method;

              return method.apply(this, arguments);
            };
          })(key, module[key], ancestor[key]);
      }

      if (callback) callback.call(module, this);
    }, this);

    return this;
  }
},

/**
 * This method gets through a list of the object its class and all the ancestors
 * and finds a hash named after property, used for configuration purposes with
 * the Observer and Options modules
 *
 * NOTE: this method will look for capitalized and uppercased versions of the
 *       property name
 *
 * @param Object a class instance
 * @param String property name
 * @return Object hash or null if nothing found
 */
Class_findSet = function(object, property) {
  var upcased = property.toUpperCase(), capcased = property.capitalize(),
    constructor = object.constructor, ancestors = 'ancestors',
    candidates = [object, constructor].concat(ancestors in constructor ? constructor[ancestors] : []),
    holder = candidates.first(function(o) { return o && (upcased in o || capcased in o) });
    
  return holder ? holder[upcased] || holder[capcased] : null;
};