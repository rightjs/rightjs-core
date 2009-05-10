/**
 * The Array class extentions
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Array.prototype, {
  /**
   * IE fix
   * returns the index of the value in the array
   *
   * @param mixed value
   * @param Integer optional offset
   * @return Integer index or -1 if not found
   */
  indexOf: Array.prototype.indexOf || function(value, from) {
    for (var i=(from<0) ? Math.max(0, this.length+from) : from || 0; i < this.length; i++)
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
  lastIndexOf: Array.prototype.lastIndexOf || function(value) {
    for (var i=this.length-1; i >=0; i--)
      if (this[i] === value)
        return i;
    return -1;
  },
  
  /**
   * calls the given callback function in the given scope for each element of the array
   *
   * NOTE: it return the array by itself
   *
   * @param Function callback
   * @param Object scope
   * @return Array this
   */
  each: function(callback, scope) {
    try {
      this.forEach(callback, scope);
    } catch(e) { if (!(e instanceof Break)) throw(e); }
    
    return this;
  },
  // recatching the original JS 1.6 method 
  forEach: Array.prototype.forEach || function(callback, scope) {
    for (var i=0; i < this.length; i++)
      callback.apply(scope, [this[i], i, this]);
  },
  
  /**
   * returns the first element of the array
   *
   * @return mixed first element of the array
   */
  first: function() {
    return this[0];
  },
  
  /**
   * returns the last element of the array
   *
   * @return mixed last element of the array
   */
  last: function() {
    return this[this.length-1];
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
   * applies the given lambda to each element in the array
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array new list of processed items
   */
  walk: function() {
    return this._call(arguments, 'c[i]=$c');
  },
  
  /**
   * creates a list of the array items which are matched in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array filtered copy
   */
  filter: function() {
    return this._call(arguments, 'if($c)c.push(v)');
  },
  
  /**
   * creates a list of the array items converted in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array collected
   */
  map: function() {
    return this._call(arguments, 'c.push($c)');
  },
    
  /**
   * similar to the concat function but it adds only the values which are not on the list yet
   *
   * @param Array to merge
   * ....................
   * @return Array new merged
   */
  merge: function() {
    for (var copy = this.clone(), i=0; i < arguments.length; i++) {
      if (isArray(arguments[i])) {
        for (var j=0; j < arguments[i].length; j++) {
          if (!copy.includes(arguments[i][j]))
            copy.push(arguments[i][j]);
        }  
      } else if (!copy.includes(arguments[i])) {
        copy.push(arguments[i]);
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
    this.each(function(value) {
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
    for (var i=0; i < arguments.length; i++)
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
   * checks if any of the array elements is logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return mixed the first non-false item or false if nothing found
   */
  any: function() {
    return this._all(arguments, 'any');
  },
  
  /**
   * checks if all the array elements are logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return Boolean check result
   */
  all: function() {
    return this._all(arguments, 'all');
  },
  
// private

  // compiles the callback function for the walk/filter/map methods
  _call: function(args, pattern) {
    var a = $A(args), m = a.shift(), c=[];
    if (isString(m)) {
      var replace = 'isFunction(v[m])?v[m].apply(v,[].concat(a).concat([v,i,this])):v[m]';
    } else {
      var s = a.shift(), replace = 'm.apply(s,[v,i,this])';
    }
    
    eval('this.each(function(v,i){'+pattern.replace('$c', replace)+'}, this);');
    
    return c;
  },
  
  // processes the all and any methods
  _all: function(args, what) {
    var args = $A(args), callback = args.shift(), scope = this;
    
    if (!callback) {
      callback = function(value) { return !!value; };
    } else if (isFunction(callback)) {
      scope = args.shift();
    } else if (isString(callback)) {
      var attr = callback;
      callback = function(value,i) {
        return !!(isFunction(value[attr]) ?
          value[attr].apply(value, [].concat(args).concat([value,i,this])) : 
          value[attr]);
      };
    }
    
    var break_value = what != 'all', result = null;
    
    this.each(function(value,i,list) {
      if (callback.apply(scope, [value,i,list]) == break_value) {
        result = what == 'all' ? false : value;
        $break();
      }
    });
    
    return result === null ? !break_value : result;
  }
});