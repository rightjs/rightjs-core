/**
 * The dom-wrapper main unit
 *
 * This unit is basically for the internal use
 * so that we could control the common functionality
 * among all the wrappers
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

var Wrapper = RightJS.Wrapper = function(parent, methods) {

  // creating the actual wrapper class
  var Klass = function(object, options) {
    this.initialize(object, options);

    var instance = this, unit = instance._, uid, cast;

    // dynamically typecasting in case if the user is creating
    // an element of a subtype via the basic Element constructor
    if (this.constructor === Element && (cast = Wrapper.Cast(unit)) !== undefined) {
      instance = new cast(unit);
      if ('$listeners' in this) {
        instance.$listeners = this.$listeners;
      }
    }

    uid  = UID_KEY in unit ? unit[UID_KEY] : (unit[UID_KEY] = UID++);

    return (Wrappers_Cache[uid] = instance);
  };

  // finding the parent
  if (!methods) {
    methods = parent;
    parent  = null;
  }

  // hooking up the extedning tools and methods
  $ext(Klass, Class_Methods).inherit(parent || Wrapper);

  // checking for the injections
  Class_attachInjections(Klass, methods);

  // including the basic tools
  return Klass.include({_: undefined}, methods);
};

// searches for a suitable class for dynamic typecasting
Wrapper.Cast = function(unit) {
  return Element_wrappers[unit.tagName];
};

// exposing the cache so it could be manupulated externally
Wrapper.Cache = Wrappers_Cache;
