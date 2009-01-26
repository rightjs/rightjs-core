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
  * @param Boolean flag if the function should not overwrite intersecting values
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
 * tries to execute all the functions passed as arguments
 *
 * NOTE: will hide all the exceptions raised by the functions
 *
 * @param Function to execute
 * ......
 * @return mixed first sucessfully executed function result or undefined by default
 */
function $try() {
  for (var i=0; i < arguments.length; i++) {
    try {
      return arguments[i]();
    } catch(e) {}
  }
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
function defined(value) {
  return value !== undefined;
};

/**
 * checks if the given value is a hash-like object
 *
 * @param mixed value
 * @return boolean check result
 */
function isHash(value) {
  return typeof(value) == 'object' && value !== null && value.constructor.toString().includes('function Object()');
};

/**
 * checks if the given value is a function
 *
 * @param mixed value
 * @return boolean check result
 */
function isFunction(value) {
  return typeof(value) == 'function';
};

/**
 * checks if the given value is a string
 *
 * @param mixed value
 * @return boolean check result
 */
function isString(value) {
  return typeof(value) == 'string' || value instanceof String;
};

/**
 * checks if the given value is an array
 *
 * @param mixed value to check
 * @return boolean check result
 */
function isArray(value) {
  return value instanceof Array;
};

/**
 * checks if the given value is a number
 *
 * @param mixed value to check
 * @return boolean check result
 */
function isNumber(value) {
  return typeof(value) == 'number' || value instanceof Number;
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
};

/**
 * creates a real instance of the Number class out of the incoming value
 *
 * NOTE: if the incomming value is a string, then it will try to convert it into float
 *
 * @param mixed value
 * @return Number instance
 */
function $N(value) {
  return new Number(isString(value) ? value.toFloat() : value);
};

/**
 * searches an element by id and/or extends it with the framework extentions
 *
 * @param String element id or Element to extend
 * @return Element or null
 */
function $(element) {
  return Element.prepare(isString(element) ? document.getElementById(element) : element);
};

/**
 * searches for elements in the document which matches the given css-rule
 *
 * @param String css-rule
 * @return Array matching elements list
 */
function $$(css_rule) {
  return $(document).select(css_rule);
};
