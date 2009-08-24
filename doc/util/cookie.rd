= Intro

{Cookie} is an object oriented wrapper over the native browser cookies support

You can work with the {Cookie} object at the class level

<code>
  Cookie.set('name', 'value');
  Cookie.set('name', 'value', {duration: 10});
  
  Cookie.get('name');
  
  Cookie.remove('name');
</code>

Or you can use usual instances

<code>
  var cookie = new Cookie('name');
  var cookie = new Cookie('name', {duration: 4});
  
  cookie.set('value');
  
  cookie.remove();
</code>

== Options

You can use the following options with your cookies

 * duration - a number of days, how long the cookie should stay alive
 * domain   - a string domain name
 * path     - a string path
 * secure   - boolean marker if the cookie should get marked as secure
 
== Values Escaping

You can safely feed the API with any strings, all the values will be
automatically encoded and decoded.

<code>
  Cookie.set('name', '%"&=*"');
  
  Cookie.get('name'); // -> '%"&=*"'
</code>

NOTE: You cannot throw objects and arrays into the method yet. The feature
will appear on the list later with the JSON functionality implementation.

### Cookie.set

== Semantic
  Cookie.set(String name, String value[, Object options]) -> Cookie

== Description
  Sets the cookie

== Example
  Cookie.set('name', 'value');
  Cookie.set('name', 'value', {duration: 4});

### Cookie.get

== Semantic
  Cookie.get(String name) -> String value or null

== Description
  Finds and reads a cookie by name. Returns null if nothing found

== Example
  Cookie.set('name', 'value');
  
  Cookie.get('name'); // -> 'value'

### Cookie.remove

== Semantic
  Cookie.remove(String name) -> Cookie 
  
== Description
  Erases cookie value by name
  
== Example
  Cookie.set('name', 'value');
  
  Cookie.remove('name');
  
  Cookie.get('name'); // -> null


### Cookie#initialize

== Semantic
  initialize(String name[, Object options])

== Description
  Basic constructor. See the list of options in the description above.

== Example
  var cookie = new Cookie('name');
  var cookie = new Cookie('name', {duration: 2});


### Cookie#set

== Semantic
  set(String value) -> Cookie self
  
== Description
  Sets the cookie value

== Example
  var cookie = new Cookie('name');
  
  cookie.set('value');
  
  cookie.get(); // -> 'value'


### Cookie#get

== Semantic
  get() -> String value or null
  
== Description
  reads the cookie value

== Example
  var cookie = new Cookie('name');
  
  cookie.set('value');
  
  cookie.get(); // -> 'value'

### Cookie#remove

== Semantic
  remove() -> Cookie self

== Description
  Erases the cookie out of the browser's memory
  
== Example
  var cookie = new Cookie('name');
  cookie.set('value');
  cookie.get(); // -> 'value'

  cookie.remove();
  
  cookie.get(); // -> null
