# Cookie

`Cookie` is an object oriented wrapper over a browser's native cookies support

You can work with the `Cookie` object at the class level

    Cookie.set('name', 'value');
    Cookie.set('name', 'value', {duration: 10});
    
    Cookie.get('name');
    
    Cookie.remove('name');

Or you can use usual instances like this

    var cookie = new Cookie('name');
    var cookie = new Cookie('name', {duration: 4});
    
    cookie.set('value');
    
    cookie.remove();

## Options

You can use the following options with your cookies

Name     | Duration                                                  |
---------|-----------------------------------------------------------|
duration | a number of days, how long the cookie should stay alive   |
domain   | a string domain name                                      |
path     | a string path                                             |
secure   | boolean marker if the cookie should get marked as secure  |
 
## Values Escaping

You can safely feed the API with any strings, all the values will be
automatically encoded and decoded.

    Cookie.set('name', '%"&=*"');
    
    Cookie.get('name'); // -> '%"&=*"'

And if you include the [JSON](/goods/json) feature on your page, then you'll
be able to save/retrieve any JSON exportable objects, like booleans, arrays
and plain objects


### .set

  Cookie.set(String name, String value[, Object options]) -> Cookie

Sets the cookie

    Cookie.set('name', 'value');
    Cookie.set('name', 'value', {duration: 4});

### .get

    Cookie.get(String name) -> String value or null

Finds and reads a cookie by name. Returns null if nothing found

    Cookie.set('name', 'value');
    
    Cookie.get('name'); // -> 'value'

### .remove

    Cookie.remove(String name) -> Cookie 

Erases cookie value by name

    Cookie.set('name', 'value');
    
    Cookie.remove('name');
    
    Cookie.get('name'); // -> null


### #initialize

    initialize(String name[, Object options])

Basic constructor. See the list of options in the description above.

    var cookie = new Cookie('name');
    var cookie = new Cookie('name', {duration: 2});


### #set

    set(String value) -> Cookie self
  
Sets the cookie value

    var cookie = new Cookie('name');
  
    cookie.set('value');
    
    cookie.get(); // -> 'value'


### #get

    get() -> String value or null
  
Reads the cookie value

    var cookie = new Cookie('name');
    
    cookie.set('value');
    
    cookie.get(); // -> 'value'


### #remove

    remove() -> Cookie self

Erases the cookie out of the browser's memory

    var cookie = new Cookie('name');
    cookie.set('value');
    cookie.get(); // -> 'value'
    
    cookie.remove();
    
    cookie.get(); // -> null
