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
  keys: function(object) {
  },
  
  values: function(object) {
  }
});