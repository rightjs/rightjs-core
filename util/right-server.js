/**
 * RightJS v2.2.1 the server-side version
 * Released under terms of the MIT license
 * Visit http://rightjs.org for more details
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */

/**
 * The server-side CommonJS builds layout
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
/**
 * The framework description object
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
var RightJS = function(value) {
  return value; // <- a dummy method to emulate the safe-mode
};

RightJS.version = "2.2.1";
RightJS.modules =["core"];



/**
 * There are some util methods
 *
 * Credits:
 *   Some of the functionality and names are inspired or copied from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */

/**
 * Some top-level variables to shortify the things
 */
var A_proto = Array.prototype,
to_s = Object.prototype.toString, slice = A_proto.slice,
Wrappers_Cache = [], UID_KEY = 'uniqueNumber',  // DON'T change the UID_KEY!

/**
 * extends the first object with the keys and values of the second one
 *
 * NOTE: the third optional argument tells if the existing values
 *       of the first object should _NOT_ get updated by the values of the second object
 *
 * @param oritinal Object destintation object
 * @param source Object source object
 * @param Boolean flag if the function should not overwrite intersecting values
 * @return Object extended destination object
 */
$ext = RightJS.$ext = function(dest, source, dont_overwrite) {
  var src = source || {}, key;

  for (key in src) {
    if (!dont_overwrite || !(key in dest)) {
      dest[key] = src[key];
    }
  }

  return dest;
},

/**
 * throws an exception to break iterations throw a callback
 *
 * @return void
 * @throws Break
 */
$break = RightJS.$break = function() {
  throw new Break();
},

/**
 * generates aliases for the object properties
 *
 * @param object Object object
 * @param names Object aliases hash
 * @return Object the extended objects
 */
$alias = RightJS.$alias = function(object, names) {
  for (var new_name in names) {
    object[new_name] = object[names[new_name]];
  }
  return object;
},

/**
 * checks if the given value or a reference points
 * to a really defined value
 *
 * NOTE: will return true for variables equal to null, false, 0, and so one.
 *
 * EXAMPLE:
 *
 *   var smth = null;
 *   defined(smth); <- will return true
 *
 *   var obj = {};
 *   defined(obj['smth']); <- will return false
 *
 * @param mixed value
 * @return boolean check result
 */
defined = RightJS.defined = function(value) {
  return typeof(value) !== 'undefined';
},


/**
 * checks if the given value is a function
 *
 * @param mixed value
 * @return boolean check result
 */
isFunction = RightJS.isFunction = function(value) {
  return typeof(value) === 'function';
},

/**
 * checks if the given value is a string
 *
 * @param mixed value
 * @return boolean check result
 */
isString = RightJS.isString = function(value) {
  return typeof(value) === 'string';
},


/**
 * checks if the given value is a number
 *
 * @param mixed value to check
 * @return boolean check result
 */
isNumber = RightJS.isNumber = function(value) {
  return typeof(value) === 'number';
},

/**
 * checks if the given value is a hash-like object
 *
 * @param mixed value
 * @return boolean check result
 */
isHash = RightJS.isHash = function(value) {
  return to_s.call(value) === '[object Object]';
},

/**
 * checks if the given value is an array
 *
 * @param mixed value to check
 * @return boolean check result
 */
isArray = RightJS.isArray = function(value) {
  return to_s.call(value) === '[object Array]';
},

/**
 * shortcut, generates an array of words from a given string
 *
 * @param String string
 * @return Array of words
 */
$w = RightJS.$w = function(string) {
  return string.trim().split(/\s+/);
},

/**
 * generates an unique id for an object
 *
 * @param Object object
 * @return Integer uniq id
 */
$uid = RightJS.$uid = function(item) {
  return UID_KEY in item ? item[UID_KEY] : (item[UID_KEY] = UID++);
},

/**
 * converts any iterables into an array
 *
 * @param Object iterable
 * @return Array list
 */
$A = RightJS.$A = function(it) {
  return slice.call(it, 0);
};

/**
 * Generating methods for native units extending
 */
var i=0, natives = 'Array Function Number String Date RegExp'.split(' '),
include_native = function() {
  for (var i=0; i < arguments.length; i++) {
    if (isHash(arguments[i])) {
      $ext(this.prototype,  arguments[i]);
      $ext(this.Methods, arguments[i]);
    }
  }
};

for (; i < natives.length; i++) {
  $ext(RightJS[natives[i]] = global[natives[i]], {
    Methods: {},
    include: include_native
  });
}

// referring those two as well
RightJS.Object = Object;
RightJS.Math   = Math;

/**
 * Checks if the data is an array and if not,
 * then makes an array out of it
 *
 * @param mixed in data
 * @return Array data
 */
function ensure_array(data) {
  return isArray(data) ? data : [data];
}


/**
 * The Object class extentions
 *
 * Credits:
 *   Some functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
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
   * A simple cloning method
   * NOTE: does not clone the things recoursively!
   *
   * @param Object object
   * @return Object clone
   */
  clone: function(object) {
    return Object.merge(object);
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
      if (!filter.include(key)) {
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
    var object = {}, i=0, args=arguments, key;
    for (; i < args.length; i++) {
      if (isHash(args[i])) {
        for (key in args[i]) {
          object[key] = isHash(args[i][key]) && !(args[i][key] instanceof Class) ?
            Object.merge(key in object ? object[key] : {}, args[i][key]) : args[i][key];
        }
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


/**
 * here are the starndard Math object extends
 *
 * Credits:
 *   The idea of random mehtod is taken from
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var Math_old_random = Math.random;

/**
 * the standard random method replacement, to make it more useful
 *
 * USE:
 *   Math.random();    // original functionality, returns a float between 0 and 1
 *   Math.random(10);  // returns an integer between 0 and 10
 *   Math.random(1,4); // returns an integer between 1 and 4
 *
 * @param min Integer minimum value if there's two arguments and maximum value if there's only one
 * @param max Integer maximum value
 * @return Float random between 0 and 1 if there's no arguments or an integer in the given range
 */
Math.random = function(min, max) {

  if (arguments.length === 0) {
    return Math_old_random();
  } else if (arguments.length === 1) {
    max = min;
    min = 0;
  }

  return ~~(Math_old_random() * (max-min+1) + ~~min);
};


/**
 * The Array class extentions
 *
 * Credits:
 *   Some of the functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var original_sort = A_proto.sort,

// JavaScript 1.6 methods recatching up or faking
for_each = A_proto.forEach || function(callback, scope) {
  for (var i=0; i < this.length; i++) {
    callback.call(scope, this[i], i, this);
  }
},

filter   = A_proto.filter || function(callback, scope) {
  for (var result=[], j=0, i=0; i < this.length; i++) {
    if (callback.call(scope, this[i], i, this)) {
      result[j++] = this[i];
    }
  }
  return result;
},

reject   = function(callback, scope) {
  for (var result=[], j=0, i=0; i < this.length; i++) {
    if (!callback.call(scope, this[i], i, this)) {
      result[j++] = this[i];
    }
  }
  return result;
},

map      = A_proto.map || function(callback, scope) {
  for (var result=[], i=0; i < this.length; i++) {
    result[i] = callback.call(scope, this[i], i, this);
  }
  return result;
},

some     = A_proto.some || function(callback, scope) {
  for (var i=0; i < this.length; i++) {
    if (callback.call(scope, this[i], i, this)) {
      return true;
    }
  }
  return false;
},

every    = A_proto.every || function(callback, scope) {
  for (var i=0; i < this.length; i++) {
    if (!callback.call(scope, this[i], i, this)) {
      return false;
    }
  }
  return true;
},

first    = function(callback, scope) {
  for (var i=0; i < this.length; i++) {
    if (callback.call(scope, this[i], i, this)) {
      return this[i];
    }
  }
  return undefined;
},

last     = function(callback, scope) {
  for (var i=this.length-1; i > -1; i--) {
    if (callback.call(scope, this[i], i, this)) {
      return this[i];
    }
  }
  return undefined;
};


//
// RightJS callbacks magick preprocessing
//

// prepares a correct callback function
function guess_callback(argsi, array) {
  var callback = argsi[0], args = slice.call(argsi, 1), scope = array, attr;

  if (typeof(callback) === 'string') {
    attr = callback;
    if (array.length !== 0 && typeof(array[0][attr]) === 'function') {
      callback = function(object) { return object[attr].apply(object, args); };
    } else {
      callback = function(object) { return object[attr]; };
    }
  } else {
    scope = args[0];
  }

  return [callback, scope];
}

// defining the manual break errors class
function Break() {}

// calls the given method with preprocessing the arguments
function call_method(func, scope, args) {
  try {
    return func.apply(scope, guess_callback(args, scope));
  } catch(e) { if (!(e instanceof Break)) { throw(e); } }

  return undefined;
}

// checks the value as a boolean
function boolean_check(i) {
  return !!i;
}

// default sorting callback
function default_sort(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}

Array.include({
  /**
   * IE fix
   * returns the index of the value in the array
   *
   * @param mixed value
   * @param Integer optional offset
   * @return Integer index or -1 if not found
   */
  indexOf: A_proto.indexOf || function(value, from) {
    for (var i=(from<0) ? Math.max(0, this.length+from) : from || 0; i < this.length; i++) {
      if (this[i] === value) {
        return i;
      }
    }
    return -1;
  },

  /**
   * IE fix
   * returns the last index of the value in the array
   *
   * @param mixed value
   * @return Integer index or -1 if not found
   */
  lastIndexOf: A_proto.lastIndexOf || function(value) {
    for (var i=this.length-1; i > -1; i--) {
      if (this[i] === value) {
        return i;
      }
    }
    return -1;
  },

  /**
   * returns the first element of the array
   *
   * @return mixed first element of the array
   */
  first: function() {
    return arguments.length ? call_method(first, this, arguments) : this[0];
  },

  /**
   * returns the last element of the array
   *
   * @return mixed last element of the array
   */
  last: function() {
    return arguments.length ? call_method(last, this, arguments) : this[this.length-1];
  },

  /**
   * returns a random item of the array
   *
   * @return mixed a random item
   */
  random: function() {
    return this.length === 0 ? undefined : this[Math.random(this.length-1)];
  },

  /**
   * returns the array size
   *
   * @return Integer the array size
   */
  size: function() {
    return this.length;
  },

  /**
   * cleans the array
   * @return Array this
   */
  clean: function() {
    this.length = 0;
    return this;
  },

  /**
   * checks if the array has no elements in it
   *
   * @return boolean check result
   */
  empty: function() {
    return this.length === 0;
  },

  /**
   * creates a copy of the given array
   *
   * @return Array copy of the array
   */
  clone: function() {
    return this.slice(0);
  },

  /**
   * calls the given callback function in the given scope for each element of the array
   *
   * @param Function callback
   * @param Object scope
   * @return Array this
   */
  each: function() {
    call_method(for_each, this, arguments);
    return this;
  },
  forEach: for_each,

  /**
   * creates a list of the array items converted in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array collected
   */
  map: function() {
    return call_method(map, this, arguments);
  },

  /**
   * creates a list of the array items which are matched in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array filtered copy
   */
  filter: function() {
    return call_method(filter, this, arguments);
  },

  /**
   * creates a list of the array items that are not matching the give callback function
   *
   * @param Function callback
   * @param Object optionl scope
   * @return Array filtered copy
   */
  reject: function() {
    return call_method(reject, this, arguments);
  },

  /**
   * checks if any of the array elements is logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return boolean check result
   */
  some: function(value) {
    return call_method(some, this, value ? arguments : [boolean_check]);
  },

  /**
   * checks if all the array elements are logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return Boolean check result
   */
  every: function(value) {
    return call_method(every, this, value ? arguments : [boolean_check]);
  },

  /**
   * applies the given lambda to each element in the array
   *
   * NOTE: changes the array by itself
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array this
   */
  walk: function() {
    this.map.apply(this, arguments).forEach(function(value, i) { this[i] = value; }, this);
    return this;
  },

  /**
   * similar to the concat function but it adds only the values which are not on the list yet
   *
   * @param Array to merge
   * ....................
   * @return Array new merged
   */
  merge: function() {
    for (var copy = this.clone(), arg, i=0; i < arguments.length; i++) {
      arg = ensure_array(arguments[i]);

      for (var j=0; j < arg.length; j++) {
        if (copy.indexOf(arg[j]) == -1) {
          copy.push(arg[j]);
        }
      }
    }
    return copy;
  },

  /**
   * flats out complex array into a single dimension array
   *
   * @return Array flatten copy
   */
  flatten: function() {
    var copy = [];
    this.forEach(function(value) {
      if (isArray(value)) {
        copy = copy.concat(value.flatten());
      } else {
        copy.push(value);
      }
    });
    return copy;
  },

  /**
   * returns a copy of the array whithout any null or undefined values
   *
   * @return Array filtered version
   */
  compact: function() {
    return this.without(null, undefined);
  },

  /**
   * returns a copy of the array which contains only the unique values
   *
   * @return Array filtered copy
   */
  uniq: function() {
    return [].merge(this);
  },

  /**
   * checks if all of the given values
   * exists in the given array
   *
   * @param mixed value
   * ....
   * @return boolean check result
   */
  includes: function() {
    for (var i=0; i < arguments.length; i++) {
      if (this.indexOf(arguments[i]) === -1) {
        return false;
      }
    }
    return true;
  },

  /**
   * returns a copy of the array without the items passed as the arguments
   *
   * @param mixed value
   * ......
   * @return Array filtered copy
   */
  without: function() {
    var filter = slice.call(arguments);
    return this.filter(function(value) {
      return filter.indexOf(value) === -1;
    });
  },

  /**
   * Shuffles the array items in a random order
   *
   * @return Array shuffled version
   */
  shuffle: function() {
    var shuff = this.clone(), j, x, i = shuff.length;

    for (; i > 0; j = Math.random(i-1), x = shuff[--i], shuff[i] = shuff[j], shuff[j] = x) {}

    return shuff;
  },

  /**
   * Default sort fix for numeric values
   *
   * @param Function callback
   * @return Array self
   */
  sort: function(callback) {
    return original_sort.apply(this, (callback || !isNumber(this[0])) ? arguments : [default_sort]);
  },

  /**
   * sorts the array by running its items though a lambda or calling their attributes
   *
   * @param Function callback or attribute name
   * @param Object scope or attribute argument
   * @return Array sorted copy
   */
  sortBy: function() {
    var pair = guess_callback(arguments, this);

    return this.sort(function(a, b) {
      return default_sort(
        pair[0].call(pair[1], a),
        pair[0].call(pair[1], b)
      );
    });
  },

  /**
   * Returns the minimal value on the list
   *
   * @return Number minimal value
   */
  min: function() {
    return Math.min.apply(Math, this);
  },

  /**
   * Returns the maximal value
   *
   * @return Number maximal value
   */
  max: function() {
    return Math.max.apply(Math, this);
  },

  /**
   * Returns a summ of all the items on the list
   *
   * @return Number a summ of values on the list
   */
  sum: function() {
    for(var sum=0, i=0; i<this.length; sum += this[i++]) {}
    return sum;
  }
});

A_proto.include = A_proto.includes;


/**
 * The String class extentions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *   The trim function taken from work of Steven Levithan
 *     - http://blog.stevenlevithan.com/archives/faster-trim-javascript
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
String.include({
  /**
   * checks if the string is an empty string
   *
   * @return boolean check result
   */
  empty: function() {
    return this == '';
  },

  /**
   * checks if the string contains only white-spaces
   *
   * @return boolean check result
   */
  blank: function() {
    return this == false;
  },

  /**
   * removes trailing whitespaces
   *
   * @return String trimmed version
   */
  trim: String.prototype.trim || function() {
    var str = this.replace(/^\s\s*/, ''), i = str.length;
    while ((/\s/).test(str.charAt(--i))) {}
    return str.slice(0, i + 1);
  },

  /**
   * returns a copy of the string with all the tags removed
   * @return String without tags
   */
  stripTags: function() {
    return this.replace(/<\/?[^>]+>/ig, '');
  },

  /**
   * removes all the scripts declarations out of the string
   * @param mixed option. If it equals true the scrips will be executed,
   *                      if a function the scripts will be passed in it
   * @return String without scripts
   */
  stripScripts: function(option) {
    var scripts = '', text = this.replace(
      /<script[^>]*>([\s\S]*?)<\/script>/img,
      function(match, source) {
        scripts += source + "\n";
        return '';
      }
    );

    if (option === true) {
      $eval(scripts);
    } else if (isFunction(option)) {
      option(scripts, text);
    }

    return text;
  },

  /**
   * extracts all the scripts out of the string
   *
   * @return String the extracted stcripts
   */
  extractScripts: function() {
    var scripts = '';
    this.stripScripts(function(s) { scripts = s; });
    return scripts;
  },

  /**
   * evals all the scripts in the string
   *
   * @return String self (unchanged version with scripts still in their place)
   */
  evalScripts: function() {
    this.stripScripts(true);
    return this;
  },

  /**
   * converts underscored or dasherized string to a camelized one
   * @returns String camelized version
   */
  camelize: function() {
    return this.replace(/(\-|_)+(.)?/g, function(match, dash, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  },

  /**
   * converts a camelized or dasherized string into an underscored one
   * @return String underscored version
   */
  underscored: function() {
    return this.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/\-/g, '_').toLowerCase();
  },

  /**
   * returns a capitalised version of the string
   *
   * @return String captialised version
   */
  capitalize: function() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  },

  /**
   * checks if the string contains the given substring
   *
   * @param String string
   * @return boolean check result
   */
  includes: function(string) {
    return this.indexOf(string) != -1;
  },

  /**
   * checks if the string starts with the given substring
   *
   * @param String string
   * @param boolean ignore the letters case
   * @return boolean check result
   */
  startsWith: function(string, ignorecase) {
    return (ignorecase !== true ? this.indexOf(string) :
      this.toLowerCase().indexOf(string.toLowerCase())
    ) === 0;
  },

  /**
   * checks if the string ends with the given substring
   *
   * @param String substring
   * @param boolean ignore the letters case
   * @return boolean check result
   */
  endsWith: function(string, ignorecase) {
    return this.length - (
      ignorecase !== true ? this.lastIndexOf(string) :
        this.toLowerCase().lastIndexOf(string.toLowerCase())
    ) === string.length;
  },

  /**
   * converts the string to an integer value
   * @param Integer base
   * @return Integer or NaN
   */
  toInt: function(base) {
    return parseInt(this, base === undefined ? 10 : base);
  },

  /**
   * converts the string to a float value
   * @param boolean flat if the method should not use a flexible matching
   * @return Float or NaN
   */
  toFloat: function(strict) {
    return parseFloat(strict === true ? this :
      this.replace(',', '.').replace(/(\d)-(\d)/, '$1.$2'));
  }

});

String.prototype.include = String.prototype.includes;


/**
 * The Function class extentions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Function.include({
  /**
   * binds the function to be executed in the given scope
   *
   * @param Object scope
   * @param mixed optional curry (left) argument
   * ....
   * @return Function binded function
   */
  bind: function() {
    var args = $A(arguments), scope = args.shift(), func = this;
    return function() {
      return func.apply(scope,
        (args.length !== 0 || arguments.length !== 0) ?
          args.concat($A(arguments)) : args
      );
    };
  },

  /**
   * binds the function as an event listener to the given scope object
   *
   * @param Object scope
   * @param mixed optional curry (left) argument
   * .......
   * @return Function binded function
   */
  bindAsEventListener: function() {
    var args = $A(arguments), scope = args.shift(), func = this;
    return function(event) {
      return func.apply(scope, [event].concat(args).concat($A(arguments)));
    };
  },

  /**
   * allows you to put some curry in your cookery
   *
   * @param mixed value to curry
   * ....
   * @return Function curried function
   */
  curry: function() {
    return this.bind.apply(this, [this].concat($A(arguments)));
  },

  /**
   * The right side curry feature
   *
   * @param mixed value to curry
   * ....
   * @return Function curried function
   */
  rcurry: function() {
    var curry = $A(arguments), func = this;
    return function() {
      return func.apply(func, $A(arguments).concat(curry));
    };
  },

  /**
   * delays the function execution
   *
   * @param Integer delay ms
   * @param mixed value to curry
   * .....
   * @return Integer timeout marker
   */
  delay: function() {
    var args  = $A(arguments), timeout = args.shift(),
        timer = new Number(setTimeout(this.bind.apply(this, [this].concat(args)), timeout));

    timer.cancel = function() { clearTimeout(this); };

    return timer;
  },

  /**
   * creates a periodical execution of the function with the given timeout
   *
   * @param Integer delay ms
   * @param mixed value to curry
   * ...
   * @return Ineger interval marker
   */
  periodical: function() {
    var args  = $A(arguments), timeout = args.shift(),
        timer = new Number(setInterval(this.bind.apply(this, [this].concat(args)), timeout));

    timer.stop = function() { clearInterval(this); };

    return timer;
  },

  /**
   * Chains the given function after the current one
   *
   * @param Function the next function
   * @param mixed optional value to curry
   * ......
   * @return Function chained function
   */
  chain: function() {
    var args = $A(arguments), func = args.shift(), current = this;
    return function() {
      var result = current.apply(current, arguments);
      func.apply(func, args);
      return result;
    };
  }
});


/**
 * The Number class extentions
 *
 * Credits:
 *   Some methods inspired by
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Number.include({
  /**
   * executes the given callback the given number of times
   *
   * @param Function callback
   * @param Object optional callback execution scope
   * @return void
   */
  times: function(callback, scope) {
    for (var i=0; i < this; i++) {
      callback.call(scope, i);
    }
    return this;
  },

  upto: function(number, callback, scope) {
    for (var i=this+0; i <= number; i++) {
      callback.call(scope, i);
    }
    return this;
  },

  downto: function(number, callback, scope) {
    for (var i=this+0; i >= number; i--) {
      callback.call(scope, i);
    }
    return this;
  },

  abs: function() {
    return Math.abs(this);
  },

  round: function(size) {
    return size ? parseFloat(this.toFixed(size)) : Math.round(this);
  },

  ceil: function() {
    return Math.ceil(this);
  },

  floor: function() {
    return Math.floor(this);
  },

  min: function(value) {
    return this < value ? value : this + 0;
  },

  max: function(value) {
    return this > value ? value : this + 0;
  }
});


/**
 * The Regexp class extentions
 *
 * Credits:
 *   Inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */


 /**
  * Escapes the string for safely use as a regular expression
  *
  * @param String raw string
  * @return String escaped string
  */
RegExp.escape = function(string) {
  return (''+string).replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1');
};


/**
 * The basic Class unit
 *
 * Credits:
 *   The Class unit is inspired by its implementation in
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
var Class = RightJS.Class = function() {
  var args   = $A(arguments).slice(0,2),
      props  = args.pop() || {},
      parent = args.pop(),
      klass  = arguments[2], // you can send your own klass as the third argument
      SKlass = function() {};

  // if the parent class only was specified
  if (!args.length && !isHash(props)) {
    parent = props; props = {};
  }

  // defining the basic klass function
  klass = $ext(klass || function() {
    Class_checkPrebind(this);
    return 'initialize' in this ?
      this.initialize.apply(this, arguments) :
      this;
  }, Class_Methods);

  // handling the inheritance
  parent = parent || Class;

  SKlass.prototype = parent.prototype;
  klass.prototype  = new SKlass();
  klass.parent     = parent;
  klass.prototype.constructor = klass;

  // collecting the list of ancestors
  klass.ancestors = [];
  while (parent) {
    klass.ancestors.push(parent);
    parent = parent.parent;
  }

  // handling the module injections
  ['extend', 'include'].each(function(name) {
    if (name in props) {
      klass[name].apply(klass, ensure_array(props[name]));
    }
  });

  return klass.include(props);
},

/**
 * Class utility methods
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
Class_Methods = {
  /**
   * this method will extend the class-level with the given objects
   *
   * NOTE: this method _WILL_OVERWRITE_ the existing itercecting entries
   *
   * NOTE: this method _WILL_NOT_OVERWRITE_ the class prototype and
   *       the class 'name' and 'parent' attributes. If one of those
   *       exists in one of the received modeuls, the attribute will be
   *       skipped
   *
   * @param Object module to extend
   * ....
   * @return Class the klass
   */
  extend: function() {
    $A(arguments).filter(isHash).each(function(module) {
      $ext(this, Class_clean_module(module, true));
      Class_handle_module_callbacks(this, module, true);
    }, this);

    return this;
  },

  /**
   * extends the class prototype with the given objects
   * NOTE: this method _WILL_OVERWRITE_ the existing itercecting entries
   * NOTE: this method _WILL_NOT_OVERWRITE_ the 'klass' attribute of the klass.prototype
   *
   * @param Object module to include
   * ....
   * @return Class the klass
   */
  include: function() {
    var klasses = [this].concat(this.ancestors);

    $A(arguments).filter(isHash).each(function(module) {
      Object.each(Class_clean_module(module, false), function(name, method) {
        // searching for the super-method
        for (var super_method, i=0; i < klasses.length; i++) {
          if (name in klasses[i].prototype) {
            super_method = klasses[i].prototype[name];
            break;
          }
        }

        this.prototype[name] = isFunction(method) && isFunction(super_method) ?
          function() {
            this.$super = super_method;
            return method.apply(this, arguments);
          } : method;
      }, this);

      Class_handle_module_callbacks(this, module, false);
    }, this);

    return this;
  }
},

Class_module_callback_names = $w(
  'selfExtended self_extended selfIncluded self_included extend include'
);

// hooking up the class-methods to the root class
$ext(Class, Class_Methods);
Class.prototype.$super = undefined;

function Class_clean_module(module, extend) {
  return Object.without.apply(Object, [module].concat(
    Class_module_callback_names.concat( extend ?
      $w('prototype parent ancestors') : ['constructor']
    )
  ));
}

function Class_handle_module_callbacks(klass, module, extend) {
  (module[Class_module_callback_names[extend ? 0 : 2]] ||
   module[Class_module_callback_names[extend ? 1 : 3]] ||
   function() {}
  ).call(module, klass);
}

/**
 * This method gets through a list of the object its class and all the ancestors
 * and finds a hash named after property, used for configuration purposes with
 * the Observer and Options modules
 *
 * NOTE: this method will look for capitalized and uppercased versions of the
 *       property name
 *
 * @param Object a class instance
 * @param String property name
 * @return Object hash or null if nothing found
 */
function Class_findSet(object, property) {
  var upcased   = property.toUpperCase(),
    constructor = object.constructor,
    candidates  = [object, constructor].concat(constructor.ancestors || []),
    i = 0;

  for (; i < candidates.length; i++) {
    if (upcased in candidates[i]) {
      return candidates[i][upcased];
    } else if (property in candidates[i]) {
      return candidates[i][property];
    }
  }

  return null;
}

/**
 * Handles the 'prebind' feature for Class instances
 *
 * @param Class instance
 * @return void
 */
function Class_checkPrebind(object) {
  if ('prebind' in object && isArray(object.prebind)) {
    object.prebind.each(function(method) {
      object[method] = object[method].bind(object);
    });
  }
}

/**
 * This is a simple mix-in module to be included in other classes
 *
 * Basically it privdes the <tt>setOptions</tt> method which processes
 * an instance options assigment and merging with the default options
 *
 * Credits:
 *   The idea of the module is inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
var Options = RightJS.Options = {
  /**
   * assigns the options by merging them with the default ones
   *
   * @param Object options
   * @return Object current instance
   */
  setOptions: function(opts) {
    var options = this.options = $ext($ext({},
      Object.clone(Class_findSet(this, 'Options'))), opts
    ), match, key;

    // hooking up the observer options
    if (isFunction(this.on)) {
      for (key in options) {
        if ((match = key.match(/on([A-Z][A-Za-z]+)/))) {
          this.on(match[1].toLowerCase(), options[key]);
          delete(options[key]);
        }
      }
    }

    return this;
  },

  /**
   * Cuts of an options hash from the end of the arguments list
   * assigns them using the #setOptions method and then
   * returns the list of other arguments as an Array instance
   *
   * @param mixed iterable
   * @return Array of the arguments
   */
  cutOptions: function(in_args) {
    var args = $A(in_args);
    this.setOptions(isHash(args.last()) ? args.pop() : {});
    return args;
  }
};


/**
 * standard Observer class.
 *
 * Might be used as a usual class or as a builder over another objects
 *
 * Credits:
 *   The naming principle is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
var Observer = RightJS.Observer = new Class({
  include: Options,

  /**
   * general constructor
   *
   * @param Object options
   */
  initialize: function(options) {
    this.setOptions(options);
    Observer_createShortcuts(this, Class_findSet(this, 'Events'));
    return this;
  },

  /**
   * binds an event listener
   *
   * USAGE:
   *  on(String event, Function callback[, arguments, ...]);
   *  on(String event, String method_name[, arguments, ...]);
   *  on(Object events_hash);
   *
   * @return Observer self
   */
  on: function() {
    Observer_on(this, arguments, function(h) { return h; });
    return this;
  },

  /**
   * checks if the observer observes given event and/or callback
   *
   * USAGE:
   *   observes(String event)
   *   observes(Function callback)
   *   observes(String event, Function callback)
   *
   * @retun boolean check result
   */
  observes: function(event, callback) {
    if (!isString(event)) { callback = event; event = null; }
    if (isString(callback)) { callback = callback in this ? this[callback] : null; }

    return (this.$listeners || []).some(function(i) {
      return (event && callback) ? i.e === event && i.f === callback :
        event ? i.e === event : i.f === callback;
    });
  },

  /**
   * stops observing an event or/and function
   *
   * USAGE:
   *   stopObserving(String event)
   *   stopObserving(Function callback)
   *   stopObserving(String event, Function callback)
   *
   * @return Observer self
   */
  stopObserving: function(event, callback) {
    Observer_stopObserving(this, event, callback, function() {});
    return this;
  },

  /**
   * returns the listeners list for the event
   *
   * NOTE: if no event was specified the method will return _all_
   *       event listeners for _all_ the events
   *
   * @param String event name
   * @return Array of listeners
   */
  listeners: function(event) {
    return (this.$listeners || []).filter(function(i) {
      return !event || i.e === event;
    }).map(function(i) { return i.f; }).uniq();
  },

  /**
   * initiates the event handling
   *
   * @param String event name
   * @param mixed optional argument
   * ........
   * @return Observer self
   */
  fire: function() {
    var args = $A(arguments), event = args.shift();

    (this.$listeners || []).each(function(i) {
      if (i.e === event) {
        i.f.apply(this, i.a.concat(args));
      }
    }, this);

    return this;
  }
}),

/**
 * adds an observer functionality to any object
 *
 * @param Object object
 * @param Array optional events list to build shortcuts
 * @return Object extended object
 */
Observer_create = Observer.create =  function(object, events) {
  $ext(object, Object.without(Observer.prototype, 'initialize', 'setOptions'), true);
  return Observer_createShortcuts(object, events || Class_findSet(object, 'Events'));
},

/**
 * builds shortcut methods to wire/fire events on the object
 *
 * @param Object object to extend
 * @param Array list of event names
 * @return Object extended object
 */
Observer_createShortcuts = Observer.createShortcuts = function(object, names) {
  (names || []).each(function(name) {
    var method_name = 'on'+name.replace(/(^|_|:)([a-z])/g,
      function(match, pre, chr) { return chr.toUpperCase(); }
    );

    if (!(method_name in object)) {
      object[method_name] = function() {
        return this.on.apply(this, [name].concat($A(arguments)));
      };
    }
  });

  return object;
};

function Observer_on(object, o_args, preprocess) {
  var args     = slice.call(o_args, 2),
      event    = o_args[0],
      callback = o_args[1],
      name     = false;

  if (isString(event)) {
    switch (typeof callback) {
      case "string":
        name     = callback;
        callback = callback in object ? object[callback] : function() {};

      case "function":
        ('$listeners' in object ? object.$listeners : (
          object.$listeners = []
        )).push(preprocess({
          e: event, f: callback, a: args, r: name || false, t: object
        }));
        break;

      default:
        if (isArray(callback)) {
          for (var i=0; i < callback.length; i++) {
            object.on.apply(object, [event].concat(
              ensure_array(callback[i])
            ).concat(args));
          }
        }
    }

  } else {
    // assuming it's a hash of key-value pairs
    args = slice.call(o_args, 1);

    for (name in event) {
      object.on.apply(object, [name].concat(
        ensure_array(event[name])
      ).concat(args));
    }
  }
}

function Observer_stopObserving(object, event, callback, preprocess) {
  if (isHash(event)) {
    for (var key in event) {
      object.stopObserving(key, event[key]);
    }
  } else {
    if (!isString(event)) {  callback = event; event = null; }
    if (isString(callback)){ callback = object[callback]; }

    object.$listeners = (object.$listeners || []).filter(function(i) {
      var result = (event && callback) ?
        (i.e !== event || i.f !== callback) :
        (event ? i.e !== event : i.f !== callback);

      if (!result) { preprocess(i); }

      return result;
    });
  }
}


if (exports) {
  $ext(exports, RightJS);
}
