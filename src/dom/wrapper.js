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

// instantiating the actual class object for a wrapper
function Wrapper_makeKlass() {
  return function(object, options) {
    this.initialize(object, options);

    var instance = this, unit = instance._, uid, cast;

    // dynamically typecasting in case if the user is creating
    // an element of a subtype via the basic Element constructor
    if (this.constructor === Element) {
      if ((cast = Wrapper.Cast(unit)) !== undefined) {
        instance = new cast(unit);
        if ('$listeners' in this) {
          instance.$listeners = this.$listeners;
        }
      }
    } else {
      // checking for prebinds in the subclasses
      Class_checkPrebind(this);
    }

    uid  = UID_KEY in unit ? unit[UID_KEY] : (unit[UID_KEY] = UID++);

    return (Wrappers_Cache[uid] = instance);
  };
}

// searches for a suitable class for dynamic typecasting
Wrapper.Cast = function(unit) {
  return unit.tagName in Element_wrappers ? Element_wrappers[unit.tagName] : undefined;
};

// exposing the cache so it could be manupulated externally
Wrapper.Cache = Wrappers_Cache;
