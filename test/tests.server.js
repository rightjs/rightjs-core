/**
 * The server-side version tests (run on node.js)
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var sys = require('sys');
var rjs = require('../build/right-server');

/**
 * Creates a string of given size
 * filled in with given symbols
 *
 * @param String initial
 * @param Integer length
 * @param String fill in sybmol
 * @return String padded one
 */
function ljust(text, length, symbol) {
  length = length || 80;
  symbol = symbol || ' ';

  for (var str='', i=0; i < length; i++) {
    str += i < text.length ? text[i] : symbol;
  }

  return str;
}

var total  = 0;
var failed = 0;

/**
 * A simple test reporter
 *
 * @param Boolean test result
 * @param String message
 * @return void
 */
function assert(result, message) {
  total ++;
  result || failed ++;

  result = result ? '   \u001B[32mOK\u001B[0m ' : ' \u001B[31mFAIL\u001B[0m ';

  console.log(ljust(" * "+message, 74) + result);
}

/**
 * asserts equality of things
 *
 * @param mixed expected
 * @param mixed actual
 * @param String message
 * @return void
 */
function assert_equal(expected, received, message) {
  assert(sys.inspect(expected) == sys.inspect(received), message);
}

// the header
console.log("\u001B[36m" + ljust("== RightJS server-side version build test =====", 80, '=') + "\u001B[0m")


/**
 * The actual tests go here
 */
assert(rjs.RightJS !== null, "RightJS presense");

// checking the utility methods
assert_equal({a:1, b:2},       rjs.$ext({a:1}, {b:2}),    "$ext()");
assert(!rjs.defined(undefined) && rjs.defined(1),         "defined()");
assert(!rjs.isFunction(1)      && rjs.isFunction(assert), "isFunction()");
assert(!rjs.isString(1)        && rjs.isString('1'),      "isString()");
assert(!rjs.isNumber('1')      && rjs.isNumber(1),        "isNumber()");
assert(!rjs.isHash(1)          && rjs.isHash({}),         "isHash()");
assert(!rjs.isArray(1)         && rjs.isArray([]),        "isArray()");

// checking the language extensions
assert_equal([1,2].first(), 1, "Array#first()");
assert_equal([1,2].last(),  2, "Array#last()");
assert_equal([1,2].size(),  2, "Array#size()");
assert_equal([1.1, 2.2].map('floor'), [1,2], "Array#map()")
assert_equal(['boo', 'hoo'].filter('include', 'bo'), ['boo'], "Array#filter()");
assert_equal(['boo', 'hoo'].reject('include', 'bo'), ['hoo'], "Array#reject()");


// testing the Class
var A = new rjs.Class();
assert(typeof(A) === 'function', 'Class creation');
var a = new A();
assert(a instanceof A, 'Class instantiation');
var B = new rjs.Class(A, {});
var b = new B();
assert(b instanceof B && b instanceof A, 'Class inheritance');


// the footer
console.log(ljust('', 80, '_'))
console.log("Total: "+total+" Tests, "+ failed + " Failed");