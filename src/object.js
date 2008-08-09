/**
 * The Object class extentions
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Object.extend = function(orig, dest, dont_overwrite) { 
  var dest = dest || {};
  
  for (var key in dest) {
    if (!(dont_overwrite && defined(orig[key]))) {
      orig[key] = dest[key];
    }
  }
  
  return orig;
};

Object.extend(Object, {
  keys: function(object) {
  },
  
  values: function(object) {
  },
  
  is_a: function(object, klass) {
    return object instanceof klass;
  },
  
  to_s: function(object) {
    return object +'';
  }
});