= Intro

RightJS comes with some collection of small handy methods which will help you 
with everyday coding operations, checks etc.

### $

== Semantic
  $(String element_id) -> Element
  $(Element element)   -> Element

== Description
  Finds element by id or extends an existing element

== Example
  $('some-id');
  $(element);


### $$

== Semantic
  $$(String css_rule) -> Array of elements

== Description
  Finds all the elements in the document which matches the given css-rule

== Example
  $$('div')


### $w

== Semantic
  $w(String string) -> Array of strings

== Description
  Splits the given string to list of words

== Example
  $w('one two    three'); // ['one', 'two', 'three']


### $A

== Semantic
  $A(Iterable it) -> Array

== Description
  Converts any iterable unit into an Array instance

== Example
  function() {
    var args = $A(arguments);
    var first = args.shift();
  };


### $E

== Semantic
  $E(String tag_name[, Object options])

== Description
  Shortcut for 'new Element'

== Example
  var div = $E('div', {id: 'some-id'});


### $ext

== Semantic
  $ext(Object first, Object second[, boolean dont_overwrite]) -> Object first

== Description
  Extends the first object with data from the second object. Skips all the 
  intersecting keys if the third argument is true

== Example
  var o = {1:1};
  $ext(o, {2:2}); // -> {1:1, 2:2}

  $ext(o, {2:4, 3:3}, true); // -> {1:1, 2:2, 3:3}

### $try

== Semantic
  $try(Function function[, Function function, ...]) -> mixed result

== Description
  Evaluates the arguments functions one by one, and returns the result of the 
  first one which does not raises any exception

== Example
  var result = $try(
    function() { throw 'error'; },
    function() { return 1; },
    function() { return 2; }
  );
  
  result // -> 1


### $eval

== Semantic
  $eval(String code)

== Description
  Evaluates the given piece of JavaScript code in the context of the current 
  window

== Example
  $eval('var foo = "bar";');
  
  window['foo']; // -> 'bar'

### $break

== Semantic
  $break()

== Description
  Initiates a manual break on the callback based iterators

== Example
  [1,2,3,4].walk(function(value, i) {
    if (i > 1) $break();
    return i * 2;
  });
  
  // [2,4,3,4]


### $alias

== Semantic
  $alias(Object object, Object aliases) -> Object the first

== Description
  Creates the object properties aliases

== Example
  var o = {
    foo: function() {};
  };
  
  $alias(o, {
    bar: 'foo'
  });
  
  // now 'foo' and 'bar' refer to the same function


### defined

== Semantic
  defined(mixed value)

== Description
  Shortcut to check if the given value is not undefined

== Example
  var o = {
    foo: 'foo'
  };
  
  defined(o['foo']); // true
  defined(o['bar']); // false


### isHash

== Semantic
  isHash(mixed value);

== Description
  Checks if the given value is a pure javascript object/hash

== Example
  isHash([1,2,3]);      // false
  isHash('foo bar');    // false
  isHash({foo: 'bar'}); // true



### isFunction

== Semantic
  isFunction(mixed value)

== Description
  Shortcut, checks if the given value is a function

== Example
  isFunction('boo');         // false
  isFunction(function() {}); // true



### isString

== Semantic
  isString(mixed value)

== Description
  Shortcut, checks if the given value is a string

== Example
  isString([]); // false
  isString({}); // false
  isString(''); // true


### isArray

== Semantic
  isArray(mixed value)

== Description
  Shortcut, checks if the given value is an instance of Array

== Example
  isArray({}); // false
  isArray(''); // false
  isArray([]); // true


### isNumber

== Semantic
  isNumber('1'); // false
  isNumber(111); // true
  isNumber(1.1); // true

== Description
  Shortcut, checks if the given value is a number

== Example
  


### isElement

== Semantic
  isElement(mixed value)

== Description
  Shortcut, checks if the given value is an HTMLElement instance

== Example
  isElement(document.createTextNode('boo'));  // false
  isElement(document.createElement('div'));   // true


### isNode

== Semantic
  isNode(mixed value)

== Description
  Shortcut, checks if the given value is a DOM node instance

== Example
  isNode(document.createTextNode('boo'));  // true
  isNode(document.createElement('div'));   // true
  
  isNode('foo'); // false

