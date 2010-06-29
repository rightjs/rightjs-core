/**
 * There are some util methods
 *
 * Credits:
 *   Some of the functionality and names are inspired or copied from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */

/**
 * Some top-level variables to shortify the things
 */
var 
document_E = 'documentElement', HTML = document[document_E], UID = 1, // !#server
UNDEF = undefined, PROTO = 'prototype', A_proto = Array[PROTO],
to_s = Object[PROTO].toString, slice = A_proto.slice,
dummy = function() { return function() {}; },
    
 
/**
 * extends the first object with the keys and values of the second one
 *
 * NOTE: the third optional argument tells if the existing values
 *       of the first object should _NOT_ get updated by the values of the second object
 *
 * @param oritinal Object destintation object
 * @param source Object source object
 * @param Boolean flag if the function should not overwrite intersecting values
 * @return Object extended destination object
 */
$ext = RightJS.$ext = function(dest, source, dont_overwrite) { 
  var src = source || {}, key;

  for (key in src)
    if (!dont_overwrite || !(key in dest))
      dest[key] = src[key];

  return dest;
},

/**
 * tries to execute all the functions passed as arguments
 *
 * NOTE: will hide all the exceptions raised by the functions
 *
 * @param Function to execute
 * ......
 * @return mixed first sucessfully executed function result or undefined by default
 */
$try = RightJS.$try = function() {
  for (var i=0, result; i < arguments.length; i++) {
    try {
      result = arguments[i]();
      break;
    } catch(e) {}
  }
  
  return result;
},

/** !#server
 * evals the given javascript text in the context of the current window
 *
 * @param String javascript
 * @return void
 */
$eval = RightJS.$eval = function(text) {
  if (!isString(text) || text.blank()) return;
  if ('execScript' in window) {
    window.execScript(text);
  } else {
    $E('script', {type: 'text/javascript', text: text}).insertTo(HTML);
  }
},

/**
 * throws an exception to break iterations throw a callback
 *
 * @return void
 * @throws Break
 */
$break = RightJS.$break = function() {
  throw new RightJS.Break();
},

/**
 * generates aliases for the object properties
 *
 * @param object Object object
 * @param names Object aliases hash
 * @return Object the extended objects
 */
$alias = RightJS.$alias = function(object, names) {
  for (var new_name in names) {
    object[new_name] = object[names[new_name]];
  }
  return object;
},

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
defined = RightJS.defined = function(value) {
  return typeof(value) !== 'undefined';
},


/**
 * checks if the given value is a function
 *
 * @param mixed value
 * @return boolean check result
 */
isFunction = RightJS.isFunction = function(value) {
  return typeof(value) === 'function';
},

/**
 * checks if the given value is a string
 *
 * @param mixed value
 * @return boolean check result
 */
isString = RightJS.isString = function(value) {
  return typeof(value) === 'string';
},


/**
 * checks if the given value is a number
 *
 * @param mixed value to check
 * @return boolean check result
 */
isNumber = RightJS.isNumber = function(value) {
  return typeof(value) === 'number';
},

/**
 * checks if the given value is a hash-like object
 *
 * @param mixed value
 * @return boolean check result
 */
isHash = RightJS.isHash = function(value) {
  return to_s.call(value) === '[object Object]' &&
    !('_' in value); // <- don't react on the dom-wrappers
},

/**
 * checks if the given value is an array
 *
 * @param mixed value to check
 * @return boolean check result
 */
isArray = RightJS.isArray = function(value) {
  return to_s.call(value) === '[object Array]';
},

/** !#server
 * checks if the given value is an element
 *
 * @param mixed value to check
 * @return boolean check result
 */
isElement = RightJS.isElement = function(value) {
  return value && value.tagName;
},

/** !#server
 * checks if the given value is a DOM-node
 *
 * @param mixed value to check
 * @return boolean check result
 */
isNode = RightJS.isNode = function(value) {
  return value && value.nodeType;
},

/** !#server
 * shortcut to instance new elements
 *
 * @param String tag name
 * @param object options
 * @return Element instance
 */
$E = RightJS.$E = function(tag_name, options) {
  return new Element(tag_name, options);
},

/** !#server
 * searches an element by id and/or extends it with the framework extentions
 *
 * @param String element id or Element to extend
 * @return Element or null
 */
$ = RightJS.$ = function(element) {
  if (typeof element === 'string') {
    var match = /^#([\w\-]+)$/.exec(element);
    element = match !== null ? document.getElementById(match[1]) : $(document).select(element);
  }
  
  if (element.nodeType === 1)
    element = new Element(element);
  else if (element.window === element)
    element = new Window(element);
  else if (element.nodeType === 9)
    element = new Document(element);
    
  return element;
},

/**
 * shortcut, generates an array of words from a given string
 *
 * @param String string
 * @return Array of words
 */
$w = RightJS.$w = function(string) {
  return string.trim().split(/\s+/);
},

/**
 * converts any iterables into an array
 *
 * @param Object iterable
 * @return Array list
 */
$A = RightJS.$A = function(it) {
  try {
    return slice.call(it);
  } catch(e) {
    for (var a=[], i=0, length = it.length; i < length; i++)
      a[i] = it[i];
    return a;
  }
},

/**
 * generates an unique id for an object
 *
 * @param Object object
 * @return Integer uniq id
 */
$uid = RightJS.$uid = function(item) {
  return item.uid || (item.uid = UID++);
},

/**
 * Makes a class to support the .include()
 * calls the same as the Class unit does
 *
 * @param Object klass
 * @return Object the klass
 */
make_extensible = function(Klass) {
  Klass.Methods = {};
  Klass.include = function() {
    var args = arguments, i=0;
    for (; i < args.length; i++) {
      if (isHash(args[i])) {
        $ext(Klass.Methods, args[i]);
        $ext(Klass[PROTO], args[i]);
      }
    }
    return Klass;
  };
  return Klass;
};


/** !#server
 * Internet Explorer needs some additional mumbo-jumbo in here
 */
if (isHash(HTML)) {
  isHash = RightJS.isHash = function(value) {
    return to_s.call(value) === '[object Object]' &&
      value !== null && typeof(value) !== 'undefined' &&
      typeof(value.hasOwnProperty) !== 'undefined' &&
      !('_' in value); // <- skips the dom-wrappers
  };
}

/**
 * Generating methods for native units extending
 */
for (var i=0, natives = [Array, Function, Number, String, Date, RegExp]; i < natives.length; i++) {
  make_extensible(natives[i]);
}

