/**
 * The Array class extentions
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Array.prototype, {
  /**
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
    return [].concat(this);
  },
  
  /**
   * applies the given lambda to each element in the array
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array self
   */
  walk: function() {
    return this.each(this._call(arguments, 'this[i]=$c'), this);
  },
  
  /**
   * creates a list of the array items which are matched in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array filtered copy
   */
  filter: function() {
    var c = [];
    this.each(this._call(arguments, 'if($c)c.push(v)', c), this);
    return c;
  },
  
  /**
   * creates a list of the array items converted in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array collected
   */
  map: function() {
    var c = [];
    this.each(this._call(arguments, 'c.push($c)', c), this);
    return c;
  },
  
  /**
   * concats all the arrays passed as the arguments
   * NOTE: this method unlike the original method 
   *       _will_change_ the array by itself
   *
   * @param Array to concat
   * ....................
   * @return Array this
   */
  concat: function() {
    for (var i=0; i < arguments.length; i++) {
      for (var j=0; j < arguments[i].length; j++) {
        this.push(arguments[i][j]);
      }
    }
    return this;
  },
  
  /**
   * similar to the concat function but it adds only the values which are not on the list yet
   *
   * @param Array to merge
   * ....................
   * @return Array self
   */
  merge: function() {
    for (var i=0; i < arguments.length; i++) {
      for (var j=0; j < arguments[i].length; j++) {
        if (!this.includes(arguments[i][j]))
          this.push(arguments[i][j]);
      }
    }
    return this;
  },
  
  /**
   * flats out complex array into a single dimension array
   *
   * @return Array flatten copy
   */
  flatten: function() {
    for (var copy = [], i=0; i < this.length; i++) {
      if (isArray(this[i])) {
        var flat = this[i].flatten();
        for (var j=0; j < flat.length; j++) {
          copy.push(flat[j]);
        }
      } else {
        copy.push(this[i]);
      }
    }
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
    for (var filter = $A(arguments), copy = [], i=0; i < this.length; i++)
      if (!filter.includes(this[i]))
        copy.push(this[i]);
    return copy;
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
  _call: function(args, pattern, c) {
    var a = $A(args), m = a.shift();
    if (isString(m)) {
      var replace = 'isFunction(v[m])?v[m].apply(v,[].concat(a).concat([v,i,this])):v[m]';
    } else {
      var s = a.shift(), replace = 'm.apply(s,[v,i,this])';
    }
    eval('var func=function(v,i){'+pattern.replace('$c', replace)+'}');
    
    return func;
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
    
    var break_value = what != 'all';
    for (var i=0; i < this.length; i++) {
      if (callback.apply(scope, [this[i],i,this]) == break_value)
        return what == 'all' ? false : this[i];
    }
    
    return !break_value;
  }
});