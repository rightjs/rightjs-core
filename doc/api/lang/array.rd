= Intro

RightJS extends the native Array class with several additional useful methods, which makes arrays pretty powerful tool in your projects. Some methods are new for JavaScript, some already exists in later specifications of JavaScript. RightJS tries to be most effective, so if your browser supports some of the methods it will use the browser's native method, if not, it will provide some manual method with the same API.

Additionally RightJS provides some new features borrowed from the RubyOnRails framework. Methods which takes a function as an argument, meant {#each}, {#map}, {#filter}, etc, in case when you need simultaneously call same method on every item in the array, you can just pass the method name as a string, and optionally pass some arguments.

For example

<code>
  var elements = some_elements_list;

  elements.each('hide');
  elements.each('addClass', 'marked');
  elements.each('observe', 'click', function() {});

  var ids = elements.map('id');
  var classes = elements.map('className').map('split', /\s+/).flatten().uniq();

  var visible_elements = elements.filter('visible');
  var marked_eleemnts  = elements.filter('hasClass', 'marked');
</code>

As you can see it's pretty nifty tool and it has almost no overhead. On most of the modern browsers it will work almost as fast as you would do it in a normal for loop.

=== Iterators Handling

Every time you call an Array method which receives a lambda function as an argument, all the cases are handled simultaneously.

If you send a function, on every call it will receive three arguments.

 * The current item
 * The item index in the array
 * And the instance of the array by itself

If you send a method name as a string for the first argument. Then on every call each item's property will be called with the additional arguments which you pass with the call. For example

<code>
  [...].each('foo', 1, 2, 3);
</code>

Every item on the array will get call for their 'foo' method with arguments 1,2,3
 

=== Performance Notes

Most of the modern browsers support the JavaScript 1.6 specification and provides a number of fast native methods to work with iterations. RightJS will reuse them internally in all possible cases, and that makes it work almost as fast as a pure DOM version would do in similar cases.

For the obsolete browsers, RightJS generates the missing methods in pure JavaScript, it certainly gives its own overhead, but it is still fairly fast for most of the cases.

And yes, don't take it in a wrong way, if you really, really need to process some huge amount of data as quickly as possible, don't be ashamed and use the old fashioned 'for' loop.


### Array#indexOf

== Semantic
  indexOf(smth) -> Integer

== Description
  Returns the integer index of an element in the array or -1 if the item not on the list.


### Array#lastIndexOf

== Semantic
  lastIndexOf(smth) -> Integer
  
== Description
  Returns the index of the last appearance of the item in the array or -1 if the item not on the list.


### Array#first

== Semantic
  first() -> mixed

== Description
  Returns the first item in the array or undefined if the array is empty


### Array#last

== Semantic
  last() -> mixed
  
== Description
  Returns the last item in the array or undefined if the array is empty


### Array#random

== Semantic
  random() -> mixed
  
== Description
  Returns a random item from the array or undefined if the array is empty

### Array#size

== Semantic
  size() -> Integer
  
== Description
  Returns the size of the array

### Array#clean

== Semantic
  clean() -> Array self
  
== Description
  Removes all the items out of the array

### Array#empty

== Semantic
  empty() -> boolean

== Description
  Checks if the array has no elements in it

### clone

== Semantic
  clone() -> new Array
  
== Description
  Creates a new array which contains all the same items as the original one

### Array#each

== Semantic
  each(Function lambda[, Object scope]) -> Array self
  each(String name[, argument, ...])    -> Array self
  
== Description
  Applies the given function in the given optional scope on every item in the array.
  
== Example
  var elements = some_html_elements_list;
  
  elements.each(function(element, i) {
    if (i % 2 == 0) {
      element.hide();
    } else {
      element.show();
    }
  });
  
  elements.each('toggle'); // will call toggle() on every element in the array
  elements.each('addClass', 'marked'); // will add the 'marked' class to every element



### Array#map

== Semantic
  map(Function lambda[, Object scope]) -> Array new
  map(String name[, argument, ...])    -> Array new
  
== Description
  Collects the results of applying the lambda function on every element of the array.
  
== Example
  var strings = ['anny', 'banny', 'manny'];
  
  strings.map(function(string, i) {
    return (i+1)+'. '+string;
  });
  
  // -> ['1. anny', '2. banny', '3. manny'];
  
  strings.map('capitalize');
  
  // -> ['Anny', 'Banny', 'Manny'];
  
  strings.map('replace', 'nn', 'b');
  
  // -> ['aby', 'baby', 'maby'];
  

### Array#filter

== Semantic
  filter(Function lambda[, Object scope]) -> Array new
  filter(String name[, argument, ...])    -> Array new
  
== Description
  Creates a new array which contains all the items from the original array which being passed to the lambda function returns true.
  
== Example
  var strings = ['anny', 'manny', 'banny', 'bob'];
  
  strings.filter(function(string, i) {
    return string.length < (i+1);
  });
  // -> ['anny', 'manny', 'banny'];
  
  strings.filter('includes', 'b');
  // -> ['banny', 'bob'];
  
  strings.filter('match', /[a-z]ann/);
  // -> ['manny', 'banny']


### Array#walk

== Semantic
  walk(Function lambda[, Object scope]) -> Array self
  walk(String name[, argument, ...])    -> Array self

== Description
  Changes every item in the array by passing them through the given lambda function

== Example
  var names = ['anny', 'manny', 'banny', 'bob'];
  
  names.walk(function(name, i) {
    return (i+1)+'. '+name;
  });
  
  // -> ['1. anny', '2. manny', '3. banny', '4. bob'];
  
  names.walk('split', '. ');
  
  // [['1', 'anny'], ['2', 'manny'], ['3', 'banny'], ['4', 'bob']];
  
  names.walk('last').walk('capitalize');
  
  // ['Anny', 'Manny', 'Banny', 'Bob'];


### Array#merge

== Semantic
  merge(Array list[, Array list, ...]) -> Array new
  
== Description
  Picks up items from the given arrays which does not exists in the current array, combine them with the items from the current array and returns the result as a new array.
  
== Example
  [0,1,2,3].merge([2,3,4], [3,4,5], [1,5,6]);
  
  // -> [0,1,2,3,4,5,6];
  

### Array#flatten

== Semantic
  flatten() -> Array new
  
== Description
  Converts a multi-dimensional array in a single dimensioned one.
  
== Example
  [0,1,[2,3,[4,5,[6,7],8],9]].flatten();
  
  // -> [0,1,2,3,4,5,6,7,8,9];


### Array#compact

== Semantic
  compact() -> Array new
  
== Description
  Creates a new array which contains all the non-null and non-undefined values from the original array
  
== Example
  [null, 0, undefined, 1, 2, 3, null].compact();
  
  // -> [0, 1, 2, 3];


### Array#uniq

== Semantic
  uniq() -> Array new
  
== Description
  Picks up all the unique values out of the original array
  
== Example
  [0,1,1,2,0,1,2,3,3].uniq();
  
  // -> [0,1,2,3];



### Array#includes

== Semantic
  includes(mixed value[, mixed value,...]) -> boolean
  
== Description
  Checks that the item appears in the array. If several items specified, checks if _all_ of them are in the array.
  
== Example
  [0,1,2,3].includes(0);   // true
  [0,1,2,3].includes(4);   // false
  [0,1,2,3].includes(1,2); // true
  [0,1,2,3].includes(2,4); // false


### without

== Semantic
  without(mixed value[, mixed value, ...]) -> Array new
  
== Description
  Creates a new array without the specified values
  
== Example
  [0,1,2,3].without(1,3);
  
  // -> [0,2];



### Array#any

== Semantic
  any();                               -> mixed item or false
  any(Function lambda[, Object scope]) -> mixed item or false
  any(String name[, argument, ...])    -> mixed item or false
  
== Description
  Returns the first non-false item or false if nothing found.
  
== Example
  [0,null,undefined].any(); // false
  [0,null,null,1].any();    // 1
  
  [0,2,4].any(function(value) {
    return value % 2 != 0;
  }); 
  // false
  
  [0,1,2,3].any(function(value) {
    return value > 1;
  });
  // 2
  
  ['a', 'b', 'c'].any('blank');      // false
  ['a', 'b', 'c'].any('match', 'b'); // 'b'


### Array#all

== Semantic
  all();                               -> boolean
  all(Function lambda[, Object scope]) -> boolean
  all(String name[, argument, ...])    -> boolean
  
== Description
  Checks if all the items on the array are non-false or return non-false value by passing them
  into the lambda function
  
== Example
  [0,1,2,3].all(); // false
  [1,2,3,4].all(); // true
  
  [0,1,2,3].all(function(value, i) {
    return value == i;
  });
  // -> true
  
  ['', ' ', '  '].all('blank'); // true
  ['', ' ', ' a'].all('blank'); // false
