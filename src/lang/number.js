/**
 * The Number class extentions
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Number.prototype, {
  /**
   * executes the given callback the given number of times
   *
   * NOTE: the callback function will receive the iteration number on each call
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
  
  abs: function() {
    return Math.abs(this);
  },
  
  round: function() {
    return Math.round(this);
  },
  
  ceil: function() {
    return Math.ceil(this);
  },
  
  floor: function() {
    return Math.floor(this);
  }
});