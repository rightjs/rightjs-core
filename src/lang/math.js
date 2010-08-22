/**
 * here are the starndard Math object extends
 *
 * Credits:
 *   The idea of random mehtod is taken from
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
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
  var rand = Math_old_random();
  
  if (min === undefined) {
    return rand;
  } else if (max === undefined) {
    max = min;
    min = 0;
  }
  
  return Math.floor(rand * (max-min+1)+min);
};