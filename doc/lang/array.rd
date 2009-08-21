= Intro

RightJS extends the native Array class with several additional useful methods, 
which make arrays pretty powerful tool in your projects. Some methods are new 
for JavaScript, some already exist in the later specifications of JavaScript. 
RightJS tries to be most effective, so if your browser supports some of the 
methods it will use the browser's native method, if not, it will provide some 
JavaScript based method with the same API.

Additionally, RightJS provides some new features borrowed from the RubyOnRails 
framework. Methods that take a function as an argument, meant {#each}, 
{#map}, {#filter}, etc, in the case when you need simultaneously call same method 
on every item in the array, you can just pass the method name as a string, and 
optionally pass some arguments too.

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

As you can see it's a pretty nifty tool, and it has almost no overhead. On most 
of the modern browsers, it will work almost as fast as you would do it in a 
normal for loop.

=== Iterators Handling

Every time you call an Array method with a lambda function as an 
argument, on every call it will receive three arguments.

 * The current item
 * The item index in the array
 * And the instance of the array by itself

If you send a method name as a string for the first argument, then on every 
call each item's property will be called with the additional arguments you
you pass with the call. For example:

<code>
  [...].each('foo', 1, 2, 3);
</code>

Every item on the array will get call for their 'foo' method with arguments 1,2,3
 


### Array#indexOf

== Semantic
  indexOf(smth) -> Integer

== Description
  Returns the integer index of an element in the array or -1 if the item is not 
  on the list.


### Array#lastIndexOf

== Semantic
  lastIndexOf(smth) -> Integer
  
== Description
  Returns the index of the last appearance of the item in the array or -1 if 
  the item is not on the list.


### Array#first

== Semantic
  first()                                  -> mixed
  first([Function lambda[, Object scope]]) -> mixed
  first([String name[, argument, ...]])    -> mixed

== Description
  Returns the first item in the array or undefined if the array is empty
  
  If a function is provided, then the method will return the first item
  that passes the check in the function
  
== Example
  [1,2,3,4].first() // -> 1
  
  [1,2,3,4].first(function(i) { return i > 1; }) // -> 2
  
  ['bar', 'foo', 'moo'].first('match', 'oo') // -> 'foo'


### Array#last

== Semantic
  last()                                  -> mixed
  last([Function lambda[, Object scope]]) -> mixed
  last([String name[, argument, ...]])    -> mixed
  
== Description
  Returns the last item in the array or undefined if the array is empty
  
  If a function is provided then the method will return the last item
  that passes the check in the function
  
== Example
  [1,2,3,4].last() // -> 4
  
  [1,2,3,4].last(function(i) { return i < 4; }) // -> 3
  
  ['foo', 'moo', 'bar'].first('match', 'oo') // -> 'moo'


### Array#random

== Semantic
  random() -> mixed
  
== Description
  Returns a random item from the array or <tt>undefined</tt> if the array is empty

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

### Array#clone

== Semantic
  clone() -> new Array
  
== Description
  Creates a new array that contains all the same items as the original one

### Array#each

== Semantic
  each(Function lambda[, Object scope]) -> Array self
  each(String name[, argument, ...])    -> Array self
  
== Description
  Applies the given function in the given optional scope on every item in the 
  array.
  
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
  Collects the results of applying the lambda function on every element of the 
  array.
  
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
  Creates a new array that contains all the items from the original array 
  that passes the check in the lambda function
  
== Example
  var strings = ['anny', 'manny', 'banny', 'bob'];
  
  strings.filter(function(string, i) {
    return string.length > (i+1);
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
  Changes every item in the array by passing them through the given lambda 
  function

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
  Picks up items from the given arrays that do not exist in the current 
  array, combine them with the items from the current array and returns the 
  result as a new array.
  
== Example
  [0,1,2,3].merge([2,3,4], [3,4,5], [1,5,6]);
  
  // -> [0,1,2,3,4,5,6];
  

### Array#flatten

== Semantic
  flatten() -> Array new
  
== Description
  Converts a multi-dimensional array in a flat list.
  
== Example
  [0,1,[2,3,[4,5,[6,7],8],9]].flatten();
  
  // -> [0,1,2,3,4,5,6,7,8,9];


### Array#compact

== Semantic
  compact() -> Array new
  
== Description
  Creates a new array that contains all the non-null and non-undefined values 
  from the original one
  
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
  Checks that the item appears in the array. If several items specified, 
  checks if _all_ of them are in the array.
  
== Example
  [0,1,2,3].includes(0);   // true
  [0,1,2,3].includes(4);   // false
  [0,1,2,3].includes(1,2); // true
  [0,1,2,3].includes(2,4); // false


### Array#without

== Semantic
  without(mixed value[, mixed value, ...]) -> Array new
  
== Description
  Creates a new array without the specified values
  
== Example
  [0,1,2,3].without(1,3);
  
  // -> [0,2];

### Array#shuffle

== Semantic
  shuffle() -> Array new

== Description
  Creates a new array that has all the same items as the original
  but in a random order

== Example
  [0,1,2,3,4].shuffle();
  
  // -> [3, 4, 0, 1, 2]
  
### Array#sortBy

== Semantic
  sortBy(Function lambda[, scope])      -> Array new
  sortBy(String attr_name[, arguments]) -> Array new

== Description
  Creates a new array by sorting the current one by the results of
  calling the lambda function or attribute of each item

== Example
  [{t:3}, {t:2}, {t:1}].sortBy(function(item) {
    return item.t;
  });
  
  // -> [{t:1}, {t:2}, {t:3}]
  
  [{t:3}, {t:2}, {t:1}].sortBy('t');
  
  // -> [{t:1}, {t:2}, {t:3}]
  
### Array#every

== Semantic
  every()                                -> boolean
  every(Function lambda[, Object scope]) -> boolean
  every(String name[, argument, ...])    -> boolean

== Description
  Checks if every item in the array matches the given check function
  
  If no function provided then every element will be checked as a
  boolean value

== Example
  [1,2,3,4].every() // -> true
  [0,1,2,3].every() // -> false
  
  [1,2,3].every(function(i) { return i > 0}) // -> true
  [0,1,2].every(function(i) { return i > 0}) // -> false
  
  ['moo', 'foo', 'boo'].every('match', 'oo') // -> true
  ['moo', 'foo', 'bar'].every('match', 'oo') // -> false
  

### Array#some

== Semantic
  some()                                -> boolean
  some(Function lambda[, Object scope]) -> boolean
  some(String name[, argument, ...])    -> boolean
  
== Description
  Checks if some of the items in the array passes the check function
  
  If no function provided, then every element will be checked as a
  boolean value
  
== Example
  [0,false,1].some()    // -> true
  [0,false,null].some() // -> false
  
  [0,1,2].some(function(i) { return i == 0; }) // -> true
  [1,2,3].some(function(i) { return i == 0; }) // -> false
  
  ['foo', 'bar'].some('match', 'bar') // -> true
  ['foo', 'boo'].some('match', 'bar') // -> false

