# Observer

`Observer` is a shared drop in base-class for the cases when you need
to implement the observer pattern. It is used in many places all over the 
framework and defines the common interface for the observable units.

## Usage
Generally `Observer` is a usual class. You can use it by itself or as
an ancestor for your own classes.

    var observer = new Observer();
    observer.on('something', function() {....});
    //....
    observer.fire('something');
    
    var MyObserver = new Class(Observer, {
      // ....
    });
    var my_observer = new MyObserver();

Or if you don't have an ability to inherit the class directly you can use its
static method called {Observer.create} to make practically any object to
behave like an observer.

    var Klass = new Class(AnotherKlass, {
      initialize: function() {
        Observer.create(this);
      }
    });
    
    var klass = new Klass();
    klass.on('something', function() {....});
    
    
    // or even like that.
    var object = {....};
    Observer.create(object);
    
    object.on('something', function() {.....});

## Shortcuts

The `Observer` unit provides an ability to generate nice looking
shortcut methods to wire and fire events that your observer supposed to
handle. To do so, you need to specify in your class an instance or class
level attribute called `EVENTS`. RightJS will watch the name
and if found, will try to generate shortcuts automatically.

    var Klass = new Class(Observer, {
      EVENTS: $w('start stop')
    });
    
    var klass = new Klass();
    klass.onStart(.....);
    klass.start();

__NOTE:__ if your class has intersecting methods the shortcuts generator 
will keep them alive and just skip the name.

## Call By Name

The `Observer` class follows the general 'call by name' feature of RightJS.
This means that instead of specifying a particular function to observe, you 
can specify a method name and some attributes, which should be called on the
event.

    var Kid = new Class(Observer, {
      callMommy: function(message) {
        alert(message);
      }
    });
    
    var kid = new Kid();
    
    kid.on('troubles', 'callMommy', 'Mommy!');
    
    // ...
    kid.fire('troubles');
  
    // now the 'callMommy' method of the kid instance will be called



### .create

    Observer.create(Object object[, Array events_list]) -> Object observable

The static observers builder, adds the observer functionality to any object.

    var object = {....};

    Observer.create(object);

    object.observe('something', function() {.....});


### .createShortcuts

    Observer.createShortcuts(Observer object, Array names) -> Object

Generates the observer shortcuts on the observable unit

    var observer = new Observer();
    
    Observer.createShortcuts(observer, ['start', 'stop']);
    
    observer.onStart(function() {});
    observer.stop();

### #initialize

    initialize([Object options])

The generic constructor. If you send with options keys like 'onSomething'
the observer will automatically wire it to the to the 'something' event.

    var observer = new Observer();
    var observer = new Observer({
      onStart: function() {},
      onFinish: 'clear'
    });
  
### #observe

    observe(String name, Function callback[, arguments])  -> Observer self
    observe(String name, String method_name[, arguments]) -> Observer self
    observe(String name, Array callbacks[, arguments])    -> Observer self
    observe(Object hash)                                  -> Observer self

Makes the observer observe the event with the callback.

__DEPRECATED__: please use the {#on} method instead

    var observer = new Observer();
    
    observer.observe('something', function() {...});
    
    // or by name
    observer.observe('something', 'observer_method_name', arg1, arg2);
    
    // or a whole list
    observer.observe('something', [func1, func2, func3, ...]);
    
    // or a hash
    observer.observe({
      one: function() {},
      two: 'something'
    })
  

### #on

    on(String name, Function callback[, arguments])  -> Observer self
    on(String name, String method_name[, arguments]) -> Observer self
    on(String name, Array callbacks[, arguments])    -> Observer self
    on(Object hash)                                  -> Observer self

Binds an event listener to the observer

    var observer = new Observer();
    
    observer.on('something', function() {...});
    
    // or by name
    observer.on('something', 'observer_method_name', arg1, arg2);
    
    // or a whole list
    observer.on('something', [func1, func2, func3, ...]);
    
    // or using a hash
    observer.on({
      one: function() {},
      two: 'something'
    });
  

### #observes

    observes(String name)                    -> boolean
    observes(Function callback)              -> boolean
    observes(String name, Function callback) -> boolean

Checks if the observer watches the given event or/and callback

    var observer = new Observer();
    var callback = function() {};
    
    observer.on('event', callback);
    
    observer.observes('event');             // -> true
    observer.observes(callback);            // -> true
    observer.observes('event', callback);   // -> true
    
    observer.observes('another_event');     // -> false
    observer.observes(another_calback);     // -> false
    observer.observes('another', callback); // -> false
  

### #stopObserving

    stopObserving(String name)                    -> Observer self
    stopObserving(Function callback)              -> Observer self
    stopObserving(String name, Function callback) -> Observer self

Makes the observer to stop observing certain callback or whole event or
some particular callback for some particular event

    var observer = new Observer();
    var callback = function() {};
    
    observer.on('event', callback);
    
    observer.stopObserving('event');
    
    observer.observes('event');           // -> false
    observer.observes(callback);          // -> false
  

### #fire

    fire(String name[, arguments, ...]) -> Observer self

Triggers an event processing

    var observer = new Observer();
    
    observer.on('something', function() {});
    
    observer.fire('something');
    
    // that function was called
  

### #listeners

    listeners([String name]) -> Array of callbacks

Returns the list of registered listeners for the given event

    var observer = new Observer();
    var callback = function() {};
    
    observer.on('something', callback);
    
    observer.listeners('something'); // -> [callback]
  
