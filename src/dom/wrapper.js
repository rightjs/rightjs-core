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
    if (typeof object === 'string') {
      object = this.construct(object, options);
    } else {
      this._ = object;
    }
    
    var instance = this;
    
    // checking if it's a direct call of the Element unit
    if (this.constructor === Element) {
      // checking if the instance should be typecasted
      if (object.tagName in Element_wrappers) {
        instance = new Element_wrappers[object.tagName](object);
        instance.$listeners = this.$listeners || [];
      }
    } else {
      this.initialize(object, options);
      object = this._;
    }
    
    return Wrappers_Cache[
      UID_KEY in object ? object[UID_KEY] : (object[UID_KEY] = UID++)
    ] = instance;
  };
  
  // finding the parent
  if (!methods) {
    methods = parent;
    parent  = null;
  }
  
  // hooking up the extedning tools and methods
  return $ext(Klass, Class_Methods)
    .inherit(parent || Wrapper)
    .include({_: undefined}, methods);
};