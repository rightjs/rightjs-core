/**
 * here are the starndard Math object extends
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Math, {
  /**
   * the standard random method replacement, to make it more useful
   *
   * USE:
   *   Math.random();    // original functionality, returns a float between 0 and 1
   *   Math.random(10);  // returns an integer between 0 and 10
   *   Math.random(1,4); // returns an integer between 1 and 4
   *
   * @param Integer minimum value if there's two arguments and maximum value if there's only one
   * @param Integer maximum value
   * @return Float random between 0 and 1 if there's no arguments or an integer in the given range
   */
  random: function(min, max) {
    var rand = this._random();
    if (arguments.length == 0)
      return rand;
    
    if (arguments.length == 1)
      var max = min, min = 0;
    
    return Math.floor(rand * (max-min+1)+min);
  },
  _random: Math.random
});