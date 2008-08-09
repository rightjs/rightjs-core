/**
 * The Object class extentions
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */

/**
 * extends the first object with the keys and values of the second one
 *
 * NOTE: the third optional argument tells if the existing values
 *       of the first object should _NOT_ get updated by the values of the second object
 *
 * @param Object destintation object
 * @param Object source object
 * @return Objecte extended destination object
 */
Object.extend = function(dest, src, dont_overwrite) { 
  var src = src || {};
  
  for (var key in src) {
    if (!(dont_overwrite && defined(dest[key]))) {
      dest[key] = src[key];
    }
  }
  
  return dest;
};

Object.extend(Object, {
  /**
   * extracts the list of the attribute names of the given object
   *
   * @param Object object
   * @return Array keys list
   */
  keys: function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    return keys;
  },
  
  /**
   * extracts the list of the attribute values of the given object
   *
   * @param Object object
   * @return Array values list
   */
  values: function(object) {
    var values = [];
    for (var key in object) {
      values.push(object[key]);
    }
    return values;
  },
  
  /**
   * returns a copy of the object which contains
   * all the same keys/values except the key-names
   * passed the the method arguments
   *
   * @param Object object
   * @param String key-name to exclude
   * .....
   * @return Object filtered copy
   */
  without: function() {
    var args = $A(arguments), object = args.shift(), filter = args[0] ? (
      args[0] instanceof Array ? args[0] : args
    ) : [];
    
    var copy = {};
    
    for (var key in object) {
      if (!filter.include(key)) {
        copy[key] = object[key];
      }
    }
    
    return copy
  }
});