/**
 * The dom-wrapper main unit
 *
 * This unit is basically for the internal use
 * so that we could control the common functionality
 * among all the wrappers
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

var Wrapper = function(parent, methods) {
  
  // creating the actual wrapper class
  var Klass = function(object, options) {
    if (typeof object === 'string') {
      object = this.construct(object, options);
    }
    
    var instance = this.initialize(object, options) || this,
      object = instance._, uid = object[UID_KEY] || (object[UID_KEY] = UID++);
    
    return Wrappers_Cache[uid] = instance;
  };
  
  // finding the parent
  if (!methods) {
    methods = parent;
    parent  = null;
  }
  
  // hooking up the extedning tools and methods
  return $ext(Klass, Class_Methods).inherit(parent)
    .include({_: UNDEF}, methods);
};