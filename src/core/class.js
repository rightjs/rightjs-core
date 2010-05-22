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
var Class = function() {
  var args = $A(arguments), properties = args.pop() || {}, parent = args.pop();
  
  // basic class object definition
  function klass() {
    var prebind = 'prebind';
    
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
  $ext(klass, Class.Methods).inherit(parent);
  
  // catching the injections
  $w('extend include').each(function(name) {
    if (properties[name]) {
      var modules = properties[name];
      klass[name].apply(klass, isArray(modules) ? modules : [modules]);
      delete(properties[name]);
    }
  });
  
  return klass.include(properties);
};

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
Class.findSet = function(object, property) {
  var upcased = property.toUpperCase(), capcased = property.capitalize(),
    constructor = object.constructor, ancestors = 'ancestors',
    candidates = [object, constructor].concat(ancestors in constructor ? constructor[ancestors] : []),
    holder = candidates.first(function(o) { return o && (upcased in o || capcased in o) });
    
  return holder ? holder[upcased] || holder[capcased] : null;
};