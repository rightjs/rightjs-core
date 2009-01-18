/**
 * The Object class extentions
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
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
   * returns a copy of the object which contains
   * all the same keys/values except the key-names
   * passed the the method arguments
   *
   * @param Object object
   * @param String key-name to exclude or an array of keys to exclude
   * .....
   * @return Object filtered copy
   */
  without: function() {
    var args = $A(arguments), object = args.shift(), filter = args[0] ? (
      isArray(args[0]) ? args[0] : args
    ) : [];
    
    var copy = {};
    
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
   * @param String key name to exclude or an array of keys to exclude
   * .....
   * @return Object filtered copy
   */
  only: function() {
    var args = $A(arguments), object = args.shift(), filter = args[0] ? (
      isArray(args[0]) ? args[0] : args
    ) : [];
    
    var copy = {};
    
    for (var i=0; i < filter.length; i++) {
      if (defined(object[filter[i]]))
        copy[filter[i]] = object[filter[i]];
    }
    
    return copy;
  },
  
  /**
   * walks through the object key-value pairs and replaces the given object properties
   * with ones which the callback function returns
   *
   * NOTE: the callback function has to return an array like [key, value]
   *       if the callbac function returns nothing or the array doesn't have
   *       the key the entry won't be changed
   *
   * WARNING: it is meant that the incomming object will be changed
   *
   * @param Object object to walk through
   * @param Function callback function
   * @return Object the incomming object with changes
   */
  walk: function(object, callback) {
    var keys = Object.keys(object);
    for (var i=0; i < keys.length; i++) {
      var values = callback(keys[i], object[keys[i]]);
      
      if (values && values[0] && defined(values[1])) {
        delete(object[keys[i]]);
        object[values[0]] = values[1];
      }
    }
    return object;
  },
  
  /**
   * walks through the object keys and change/rename/remove them, keeping the values the same
   *
   * NOTE: if the callback function returns null, that means the key/value won't be changed
   *       so if you just need to iterate through the keys don't return anything in the
   *       callback function
   *
   * WARNING: will change the incoming object
   *
   * @param Object object to process
   * @param Function callback process
   * @return Object the incoming object after procesing
   */
  eachKey: function(object, callback) {
    return Object.walk(object, function(key, value) {
      return [callback(key), value];
    });
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
      if (typeof(args[i])=='object') {
        $ext(object, args[i]);
      }
    }
    return object;
  }
});