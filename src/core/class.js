/**
 * The basic Class unit
 *
 * Credits:
 *   The Class unit is inspired by its implementation in
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Class = function() {
  var args = $A(arguments), properties = args.pop() || {}, parent = args.pop();

  // if only the parent class has been specified
  if (!args.length && !isHash(properties)) {
    parent = properties; properties = {};
  }

  // basic class object definition
  var klass = function() {
    return this.initialize ? this.initialize.apply(this, arguments) : this;
  };

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

