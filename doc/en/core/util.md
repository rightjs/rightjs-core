# Utility Functions

RightJS comes with a collection of utility functions for the most common
JavaScript development operations. Most of them might be seen in other
frameworks like [Prototype](http://prototypejs.org) or
[Mootools](http://mootools.net), in RightJS they have the same meaning and 
interfaces.

### $

    $(String element_id) -> Element
    $(Element element)   -> Element

Finds an element by its ID or prepares an existing element

    $('some-id');
    $(element);


### $$

    $$(String css_rule) -> Array of elements

Finds all the elements on the page that match the given css-rule. It supports
any valid CSS3 selectors.

__NOTE__: this method will return an _empty_ list if nothing was found

    $$('div > span.foo');


### $w

    $w(String string) -> Array of strings

Splits the given string into a list of words by spaces

    $w('one two    three'); // -> ['one', 'two', 'three']


### $A

    $A(Iterable it) -> Array

Converts any iterable object into an {Array} instance

    function() {
      var args = $A(arguments);
      var first = args.shift();
    };


### $E

    $E(String tag_name[, Object options]) -> Element new

A shortcut for 'new Element'

    var div = $E('div', {id: 'some-id'});


### $ext

    $ext(Object first, Object second[, boolean dont_overwrite]) -> Object first

Extends the first object with data from the second one.
  
If the third argument is `true`, then it skips all the overlapping keys

    var o = {1:1};
    $ext(o, {2:2}); // -> {1:1, 2:2}
    
    $ext(o, {2:4, 3:3}, true); // -> {1:1, 2:2, 3:3}


### $try

    $try(Function function[, Function function, ...]) -> mixed result

Evaluates the argument functions one by one and returns the result of the 
first one that _does not_ raises any exception

    var result = $try(
      function() { throw 'error'; },
      function() { return 1; },
      function() { return 2; }
    );
    
    result // -> 1


### $eval

    $eval(String code) -> void

Evaluates the given piece of JavaScript code in the context of the current 
window

    $eval('var foo = "bar";');
    
    window['foo']; // -> 'bar'


### $break

    $break() -> void

Initiates a manual break in case of callback based iterations

    [1,2,3,4].walk(function(value, i) {
      if (i > 1) $break();
      return i * 2;
    });
    
    // [2,4,3,4]


### $alias

    $alias(Object object, Object aliases) -> Object the first

Creates the first object property aliases

    var object = {
      foo: function() {};
    };
    
    $alias(object, {
      bar: 'foo'
    });
    
    // now 'foo' and 'bar' both refer to the same function


### defined

    defined(mixed value) -> boolean check result

Checks if the given value is equal to `undefined`

    var object = {
      foo: 'foo'
    };
    
    defined(object.foo); // -> true
    defined(object.bar); // -> false


### isHash

    isHash(mixed value) -> boolean check result

Checks if the given value is a pure JavaScript object (a hash)

    isHash([1,2,3]);      // -> false
    isHash('foo bar');    // -> false
    isHash({foo: 'bar'}); // -> true



### isFunction

    isFunction(mixed value) -> boolean check result

Checks if the given value is a {Function}

    isFunction('boo');         // -> false
    isFunction(function() {}); // -> true



### isString

    isString(mixed value) -> boolean check result

Checks if the given value is a {String}

    isString([]); // -> false
    isString({}); // -> false
    isString(''); // -> true


### isArray

    isArray(mixed value) -> boolean check result

Checks if the given value is an instance of {Array}

    isArray({}); // -> false
    isArray(''); // -> false
    isArray([]); // -> true


### isNumber

    isNumber(mixed value) -> boolean check result

Checks if the given value is a {Number}

    isNumber('1'); //  -> false
    isNumber(111); //  -> true
    isNumber(1.1); //  -> true
  


### isElement

    isElement(mixed value) -> boolean check result

Checks if the given value is a {HTMLElement} instance

    isElement(document.createTextNode('boo')); // -> false
    isElement(document.createElement('div'));  // -> true


### isNode

    isNode(mixed value) -> boolean check result

Checks if the given value is a DOM node (both TextNode or HTMLElement)

    isNode(document.createTextNode('boo')); // -> true
    isNode(document.createElement('div'));  // -> true
    
    isNode('foo'); // -> false

