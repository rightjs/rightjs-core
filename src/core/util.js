/**
 * There are some util methods
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */

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