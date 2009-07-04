=Intro

The {Object} unit in RightJS has some pretty much standard additional methods
which provides frequently used functionality for the objects processing

If you need more functional Hash class you can take it at the rightjs-goods
project.

### Object.keys

== Semantic
  Object.keys(Object object) -> Array keys

== Description
  Collects the object keys list

== Example
  Object.keys({'a':1, 'b':2, 'c':3})
  
  // -> ['a', 'b', 'c']


### Object.values

== Semantic
  Object.values(Object object) -> Array values

== Description
  Collects the object values list

== Example
  Object.values({'a':1, 'b':2, 'c':3})
  
  // -> [1, 2, 3]
  

### Object.empty

== Semantic
  Object.empty(Object object) -> boolean

== Description
  Checks if the object has any key-value pairs in it

== Example
  Object.empty({'a':1}) // false
  Object.empty({})      // true

### Object.without

== Semantic
  Object.without(Object object, String key[, keys..]) -> Object new

== Description
  Creates a new object which contains all the same key - value pairs as the
  original but without the given keys

== Example
  var object = {'a': 1, 'b': 2, 'c': 3};
  Object.without(object, 'b');
  
  // -> {'a': 1, 'c': 3}

### Object.only

== Semantic
  Object.only(Object object, String key[, keys...]) -> Object new

== Description
  Creates a new object which contains the specified key-value pairs of the
  original object.

== Example
  var object = {'a': 1, 'b': 2, 'c': 3};
  Object.only(object, 'b', 'c');
  
  // -> {'b': 2, 'c': 3}

### Object.merge

== Semantic
  Object.merge(Object o1, Object o2[, objects..]) -> Object new

== Description
  Creates a new object which contains all the key-value pairs of the given
  objects

== Example
  Object.merge({'a': 1, 'b': 2}, {'c': 3});
  
  // -> {'a': 1, 'b': 2, 'c': 3}

### Object.toQueryString

== Semantic
  Object.toQueryString(Object object) -> String

== Description
  Converts an object into an url options string

== Example
  Object.toQueryString({a:'a', b:'b', c:'%#?'}));
  
  // -> 'a=a&b=b&c=%25%23%3F'
