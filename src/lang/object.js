/**
 * The Object class extentions
 *
 * Credits:
 *   Some functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
$ext(Object, {
  /**
   * extracts the list of the attribute names of the given object
   *
   * @param Object object
   * @return Array keys list
   */
  keys: function(object) {
    var keys = [], key;
    for (key in object) {
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
    var values = [], key;
    for (key in object) {
      values.push(object[key]);
    }
    return values;
  },

  /**
   * Calls the function with every key/value pair on the hash
   *
   * @param in Object the data hash
   * @param Function the callback
   * @param scope Object an optional scope
   * @return Object the original hash
   */
  each: function(object, callback, scope) {
    for (var key in object) {
      callback.call(scope, key, object[key]);
    }

    return object;
  },

  /**
   * checks if the object-hash has no keys
   *
   * @param Object object
   * @return check result
   */
  empty: function(object) {
    for (var key in object) { return false; }
    return true;
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
    var filter = $A(arguments), object = filter.shift(), copy = {}, key;

    for (key in object) {
      if (!filter.includes(key)) {
        copy[key] = object[key];
      }
    }

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
    var filter = $A(arguments), object = filter.shift(), copy = {},
        i=0, length = filter.length;

    for (; i < length; i++) {
      if (filter[i] in object) {
        copy[filter[i]] = object[filter[i]];
      }
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
   * @param first Object object
   * @param second Object mixing
   * ......
   * @return Object merged object
   */
  merge: function() {
    var object = {}, i=0, length = arguments.length;
    for (; i < length; i++) {
      if (isHash(arguments[i])) {
        $ext(object, arguments[i]);
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
    var tokens = [], key, value, encode = encodeURIComponent;
    for (key in object) {
      value = ensure_array(object[key]);
      for (var i=0; i < value.length; i++) {
        tokens.push(encode(key) +'='+ encode(value[i]));
      }
    }
    return tokens.join('&');
  }
}, true);
