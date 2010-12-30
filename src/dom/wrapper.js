/**
 * The dom-wrapper main unit
 *
 * This unit is basically for the internal use
 * so that we could control the common functionality
 * among all the wrappers
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

var Wrapper = RightJS.Wrapper = new Class({
  // predefining the property in the prototype
  _: undefined,

  /**
   * Default constructor
   *
   * @param mixed raw dom unit
   * @return void
   */
  initialize: function(raw_object) {
    this._ = raw_object;
  }
});

// exposing the cache so it could be manupulated externally
Wrapper.Cache = Wrappers_Cache;

// instantiating the actual class object for a wrapper
function Wrapper_makeKlass() {
  /**
   * Default wrappers Klass function
   *
   * @param mixed the raw object
   * @param Object options
   * @return void
   */
  return function(object, options) {
    Class_checkPrebind(this);
    this.initialize(object, options);
    Wrappers_Cache[$uid(this._)] = this;
  };
}
