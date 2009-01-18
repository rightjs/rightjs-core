/**
 * The basic Class unit
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Class = function() {
  var args = $A(arguments), properties = args.pop() || {}, parent = args.pop();
  
  // if only the parent class has been specified
  if (arguments.length == 1 && typeof(properties) == 'function') {
    parent = properties; properties = {};
  }
  
  // basic class object definition
  var klass = function() {
    return this.initialize ? this.initialize.apply(this, arguments) : this;
  };
  
  // attaching main class-level methods
  $ext(klass, Class.Methods);
  
  // handling the parent class assign
  Class.Util.catchSuper(klass, parent);
  klass.prototype.constructor = klass; // <- don't put it lower
  
  // handling the inlinde extends and includes
  Class.Util.catchExtends(klass, properties);
  Class.Util.catchIncludes(klass, properties);
  
  klass.include(properties);
  
  return klass;
};