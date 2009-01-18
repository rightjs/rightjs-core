/**
 * There are some util methods
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
 
 /**
  * extends the first object with the keys and values of the second one
  *
  * NOTE: the third optional argument tells if the existing values
  *       of the first object should _NOT_ get updated by the values of the second object
  *
  * @param Object destintation object
  * @param Object source object
  * @return Objecte extended destination object
  */
function $ext(dest, src, dont_overwrite) { 
   var src = src || {};

   for (var key in src)
     if (!(dont_overwrite && defined(dest[key])))
       dest[key] = src[key];

   return dest;
 };

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
function defined(n) {
  return n !== undefined;
};

function isObject(value) {
  return typeof(value) == 'object' && value !== null;
};

function isFunction(value) {
  return typeof(value) == 'function';
}

/**
 * converts any iterables into an array
 *
 * @param Object iterable
 * @return Array list
 */
function $A(it) {
  var a = [];
  for (var i=0; i < it.length; i++)
    a.push(it[i]);
  return a;
}
