/**
 * The Array class extentions
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Object.extend(Array.prototype, {
  /**
   * returns the index of the value in the array
   *
   * @param mixed value
   * @return Integer index or -1 if not found
   */
  indexOf: Array.prototype.indexOf ? Array.prototype.indexOf : function(value) {
    for (var i=0; i < this.length; i++) {
      if (this[i] == value) {
        return i;
      }
    }
    return -1;
  },
  
  /**
   * returns the last index of the value in the array
   *
   * @param mixed value
   * @return Integer index or -1 if not found
   */
  lastIndexOf: Array.prototype.lastIndexOf ? Array.prototype.lastIndexOf : function(value) {
    for (var i=this.length-1; i >=0; i--) {
      if (this[i] == value) {
        return i;
      }
    }
    return -1;
  },
  
  /**
   * calls the given callback function in the given scope for each element of the array
   *
   * NOTE: we slightly overload the method to make it return the array by itself
   *
   * @param Function callback
   * @param Object scope
   * @return Array this
   */
  forEach: function(callback, scope) {
    this._forEach(callback, scope);
    return this;
  },
  // recatching the original JS 1.6 method 
  _forEach: Array.prototype.forEach ? Array.prototype.forEach : function(callback, scope) {
    for (var i=0; i < this.length; i++) {
      callback.apply(scope, [this[i], i, this]);
    }
  },
  
  /**
   * checks if all of the given values
   * exists in the given array
   *
   * @param mixed value
   * ....
   * @return boolean check result
   */
  include: function() {
    for (var i=0; i < arguments.length; i++) {
      if (this.indexOf(arguments[i]) == -1) {
        return false;
      }
    }
    return true;
  }
});