= Intro

<tt>Observer</tt> is a shared drop in base-class for the cases when you need
to implement the observer pattern. It is used in many places all over the 
framework and defines the common interface for the observable units.

== Usage
Generally <tt>Observer</tt> is a usual class. You can use it by itself or as
an ancestor for your own classes.

<code>
  var observer = new Observer();
  observer.on('something', function() {....});
  //....
  observer.fire('something');
  
  var MyObserver = new Class(Observer, {
    // ....
  });
  var my_observer = new MyObserver();
</code>

Or if you don't have an ability to inherit the class directly you can use its
static method called {Observer.create} to make practically any object to
behave like an observer.

<code>
  var Klass = new Class(AnotherKlass, {
    initialize: function() {
      Observer.create(this);
    }
  });
  
  var klass = new Klass();
  klass.observe('something', function() {....});
  
  
  // or even like that.
  var object = {....};
  Observer.create(object);
  
  object.observe('something', function() {.....});
</code>

== Shortcuts
The <tt>Observer</tt> unit provides an ability to generate nice looking
shortcut methods to wire and fire events that your observer supposed to
handle. To do so, you need to specify in your class an instance or class
level attribute called <tt>EVENTS</tt>. RightJS will watch the name
and if found, will try to generate shortcuts automatically.

<code>
  var Klass = new Class(Observer, {
    EVENTS: $w('start stop')
  });
  
  var klass = new Klass();
  klass.onStart(.....);
  klass.start();
</code>

<b>NOTE:</b> if your class has intersecting methods the shortcuts generator 
will keep them alive and just skip the name.

== Call By Name
The Observer class follows the general 'call by name' feature of RightJS. This
means that instead of specifying a particular function to observe, you can
specify a method name and some attributes, which should be called on the event.

<code>
  var Kid = new Class(Observer, {
    callMommy: function(what) {
    }
  });
  
  var kid = new Kid();
  
  kid.on('danger', 'callMommy', 'danger');
  
  // ...
  kid.fire('danger');
  
  // now the 'callMommy' method of the kid instance will be called
</code>


### Observer#initialize

== Semantic
  initialize([Object options])

== Description
  The generic constructor. If you send with options keys like
  'onSomething' the observer will automatically wire the value
  to the 'something' event.

== Example
  var observer = new Observer();
  var observer = new Observer({
    onStart: function() {},
    onFinish: 'clear'
  });
  
### Observer.create

== Semantic
  Observer.create(Object object[, Array events_list]) -> Object observable

== Description
  The static observers builder, adds the observer functionality to any object.

== Example
  var object = {....};
  
  Observer.create(object);
  
  object.observe('something', function() {.....});
  

### Observer.createShortcuts

== Semantic
  Observer.createShortcuts(Observer object, Array names) -> Object

== Description
  Generates the observer shortcuts on the observable unit

== Example
  var observer = new Observer();
  
  Observer.createShortcuts(observer, ['start', 'stop']);
  
  observer.onStart(function() {});
  observer.stop();
  

### Observer#observe

== Semantic
  observe(String name, Function callback[, arguments])  -> Observer self
  observe(String name, String method_name[, arguments]) -> Observer self
  observe(Object hash)                                  -> Observer self

== Description
  Makes the observer observe the event with the callback.

== Example
  var observer = new Observer();
  
  observer.observe('something', function() {...});
  
  // or
  observer.observe('something', 'observer_method_name', arg1, arg2);
  
  // or
  observer.observe({
    one: function() {},
    two: 'something'
  })
  

### Observer#on

== Semantic
  on(String name, Function callback[, arguments])  -> Observer self
  on(String name, String method_name[, arguments]) -> Observer self

== Description
  Short alias for {Observer#observe}

== Example
  var observer = new Observer();
  
  observer.on('something', function() {...});
  observer.on('something', 'observer_method_name', arg1, arg2);
  observer.on({
    one: function() {},
    two: 'something'
  })
  

### Observer#observes

== Semantic
  observes(String name)                    -> boolean
  observes(Function callback)              -> boolean
  observes(String name, Function callback) -> boolean

== Description
  Checks if the observer watches the given event or callback

== Example
  var observer = new Observer();
  var callback = function() {};
  
  observer.observe('event', callback);
  
  observer.observes('event');           // true
  observer.observes(callback);          // true
  observer.observes('event', callback); // true
  
  observer.observes('another_event');   // false
  observer.observes(another_calback);   // false
  observer.observes('another', callback); // false
  

### Observer#stopObserving

== Semantic
  stopObserving(String name)                    -> Observer self
  stopObserving(Function callback)              -> Observer self
  stopObserving(String name, Function callback) -> Observer self

== Description
  Makes the observer to stop observe certain callback or whole event or
  some particular callback for some particular event

== Example
  var observer = new Observer();
  var callback = function() {};
  
  observer.observe('event', callback);
  
  observer.stopObserving('event');
  
  observer.observes('event');           // false
  observer.observes(callback);          // false
  

### Observer#fire

== Semantic
  fire(String name[, arguments, ...]) -> Observer self

== Description
  Initiates some event handling.

== Example
  var observer = new Observer();
  
  observer.observe('something', function() {});
  
  observer.fire('something');
  
  // the wired function was called
  

### Observer#listeners

== Semantic
  listeners(String name) -> Array of callbacks

== Description
  Returns the list of registered listeners for the given event

== Example
  var observer = new Observer();
  var callback = function() {};
  
  observer.observe('something', callback);
  
  observer.listeners('something'); // -> [callback]
  
