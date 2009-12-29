# Object

The {Object} unit in RightJS has some pretty much standard additional methods
that provide frequently used functionality for the objects processing

### .keys

    Object.keys(Object object) -> Array keys

Collects the object keys list

    Object.keys({'a':1, 'b':2, 'c':3})
    
    // -> ['a', 'b', 'c']


### .values

  Object.values(Object object) -> Array values

Collects the object values list

    Object.values({'a':1, 'b':2, 'c':3})
    
    // -> [1, 2, 3]
  

### .empty

    Object.empty(Object object) -> boolean

Checks if the object has any key-value pairs in it

    Object.empty({'a':1}) // -> false
    Object.empty({})      // -> true

### .without

    Object.without(Object object, String key[, keys..]) -> Object new

Creates a new object that contains all the same key - value pairs as the
original, but without the given keys

    var object = {'a': 1, 'b': 2, 'c': 3};
    Object.without(object, 'b');
    
    // -> {'a': 1, 'c': 3}

### .only

    Object.only(Object object, String key[, keys...]) -> Object new

Creates a new object that contains only the specified key-value pairs of the
original object.

    var object = {'a': 1, 'b': 2, 'c': 3};
    Object.only(object, 'b', 'c');
    
    // -> {'b': 2, 'c': 3}

### .merge

    Object.merge(Object o1, Object o2[, objects..]) -> Object new

Creates a new object that contains all the key-value pairs of the given
objects

    Object.merge({'a': 1, 'b': 2}, {'c': 3});
    
    // -> {'a': 1, 'b': 2, 'c': 3}

### .toQueryString

    Object.toQueryString(Object object) -> String

Converts the object into an url options string

    Object.toQueryString({a:'a', b:'b', c:'%#?'}));
    
    // -> 'a=a&b=b&c=%25%23%3F'
