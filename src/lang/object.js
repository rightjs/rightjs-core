/**
 * The Object class extentions
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Object, {
  /**
   * extracts the list of the attribute names of the given object
   *
   * @param Object object
   * @return Array keys list
   */
  keys: function(object) {
    var keys = [];
    for (var key in object)
      keys.push(key);
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
    for (var key in object)
      values.push(object[key]);
    return values;
  },
  
  /**
   * checks if the object-hash has no keys
   *
   * @param Object object
   * @return check result
   */
  empty: function(object) {
    for (var key in object) break;
    return !key;
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
    var filter = $A(arguments), object = filter.shift(), copy = {};
    
    for (var key in object)
      if (!filter.includes(key))
        copy[key] = object[key];
    
    return copy;
  },
  
  /**
   * returns a copy of the object which contains all the
   * key/value pairs from the specified key-names list
   *
   * NOTE: if some key does not exists in the original object, it will be just skipped
   *
   * @param Object object
   * @param String key name to exclude
   * .....
   * @return Object filtered copy
   */
  only: function() {
    var filter = $A(arguments), object = filter.shift(), copy = {};
    
    for (var i=0; i < filter.length; i++) {
      if (defined(object[filter[i]]))
        copy[filter[i]] = object[filter[i]];
    }
    
    return copy;
  },
    
  /**
   * merges the given objects and returns the result
   *
   * NOTE this method _DO_NOT_ change the objects, it creates a new object
   *      which conatins all the given ones. 
   *      if there is some keys introspections, the last object wins.
   *      all non-object arguments will be omitted
   *
   * @param Object object
   * @param Object mixing
   * ......
   * @return Object merged object
   */
  merge: function() {
    var args = $A(arguments), object = {};
    for (var i=0; i < args.length; i++) {
      if (isHash(args[i])) {
        $ext(object, args[i]);
      }
    }
    return object;
  },
  
  /**
   * converts a hash-object into an equivalent url query string
   *
   * @param Object object
   * @return String query
   */
  toQueryString: function(object) {
    var tokens = [];
    for (var key in object) {
      tokens.push(key+'='+encodeURIComponent(object[key]))
    }
    return tokens.join('&');
  }
});