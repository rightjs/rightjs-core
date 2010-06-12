/**
 * The Array class extentions
 *
 * Credits:
 *   Some of the functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var original_sort = A_proto.sort,

build_loop = function(pre, body, ret) {
  return eval('[function(c,s){'+
    'for(var '+pre+'i=0,l=this.length;i<l;i++){'+
      body.replace('_', 'c.call(s,this[i],i,this)') + 
    '}' +
    ret
  +'}]')[0];
},
  
// JavaScript 1.6 methods recatching up or faking
for_each = A_proto.forEach || build_loop('', '_', ''),
filter   = A_proto.filter  || build_loop('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
map      = A_proto.map     || build_loop('r=[],', 'r[i]=_', 'return r'),
some     = A_proto.some    || build_loop('', 'if(_)return true', 'return false'),
every    = A_proto.every   || build_loop('', 'if(!_)return false', 'return true'),
first    = build_loop('', 'if(_)return this[i]', 'return [][0]'),
last     = function(callback, scope) {
  for (var i=this.length-1; i > -1; i--) {
    if (callback.call(scope, this[i], i, this))
      return this[i];
  }
  return UNDEF;
};
  
  
//
// RightJS callbacks magick preprocessing
//

// prepares a correct callback function
function guess_callback(argsi, array) {
  var callback = argsi[0], args = slice.call(argsi, 1), scope = array, attr;
  
  if (isString(callback)) {
    attr = callback;
    if (array.length && isFunction(array[0][attr])) {
      callback = function(object) { return object[attr].apply(object, args); };
    } else {
      callback = function(object) { return object[attr]; };
    }
  } else {
    scope = args[0];
  }
  
  return [callback, scope];
};

// calls the given method with preprocessing the arguments
function call_method(func, scope, args) {
  try {
    var result = func.apply(scope, guess_callback(args, scope));
  } catch(e) { if (!(e instanceof RightJS.Break)) throw(e); }
  
  return result;
};

// checks the value as a boolean
function boolean_check(i) {
  return !!i;
};

// default sorting callback
function default_sort(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
  
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
    for (var i=(from<0) ? Math.max(0, this.length+from) : from || 0, l = this.length; i < l; i++)
      if (this[i] === value)
        return i;
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
    for (var i=this.length-1; i > -1; i--)
      if (this[i] === value)
        return i;
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
    return this.length ? this[Math.random(this.length-1)] : null;
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
    return !this.length;
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
    for (var copy = this.clone(), arg, i=0, j, length = arguments.length; i < length; i++) {
      arg = arguments[i];
      arg = isArray(arg) ? arg : [arg];
      
      for (j=0; j < arg.length; j++) {
        if (copy.indexOf(arg[j]) == -1)
          copy.push(arg[j]);
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
    return this.without(null, UNDEF);
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
    for (var i=0, length = arguments.length; i < length; i++)
      if (this.indexOf(arguments[i]) == -1)
        return false;
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
    var filter = $A(arguments);
    return this.filter(function(value) {
      return !filter.includes(value);
    });
  },
  
  /**
   * Shuffles the array items in a random order
   *
   * @return Array shuffled version
   */
  shuffle: function() {
    var shuff = this.clone(), j, x, i = shuff.length;
    
    for (; i; j = Math.random(i-1), x = shuff[--i], shuff[i] = shuff[j], shuff[j] = x) {;}
    
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
    for(var i=0,l=this.length,sum=0; i < l; sum += this[i++]) {;}
    return sum;
  }
});

$alias(A_proto, {
  include: 'includes',
  all: 'every',
  any: 'some'
});
