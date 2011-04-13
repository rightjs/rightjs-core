/**
 * The Number class extentions
 *
 * Credits:
 *   Some methods inspired by
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
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

  /**
   * Maps a list of numbers from current to given
   * or map a result of calls of the callback on those numbers
   *
   * @param {Number} end number
   * @param {Function} optional callback
   * @param {Object} optional callback scope
   * @return {Array} the result list
   */
  to: function(number, callback, scope) {
    var start = this + 0, end = number, result = [], i=start;

    callback = callback || function(i) { return i; };

    if (end > start) {
      for (; i <= end; i++) {
        result.push(callback.call(scope, i));
      }
    } else {
      for (; i >= end; i--) {
        result.push(callback.call(scope, i));
      }
    }

    return result;
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
