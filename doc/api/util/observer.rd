= Intro

<tt>Observer</tt> is a shared drop in base-class for the cases when you need
to implement the observer pattern. It is used in many places in the 
framework and defines the common interface for the observable units.

== Usage
Generally <tt>Observer</tt> is an usual class. You can use it by itself or as
an ancestor for your classes in a usual way.

<code>
  var observer = new Observer();
  observer.on('something', function() {....});
  //....
  observer.fire();
  
  var MyObserver = new Class(Observer, {
    // ....
  });
  var my_observer = new MyObserver();
</code>

Or if you don't have ability to inherit the class directly you can use its
static method called {Observer.create} to make practically any object to
have an observer functionality/behavior.

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
The <tt>Observer</tt> unit provides you ability to generate nice looking
shortcut methods to wire and fire events which your observer supposed to be
handling. To do so, you need to specify the list of your events in the
<tt>shorts</tt> key of options you send to the Observer constructor or with
the {Observer.create} method.

<code>
  var observer = new Obsever({
    shorts: $w('start stop');
  });
  
  // now the observer object will have four methods
  //
  // * onStart
  // * onStop
  // * start
  // * stop
  //
  // the first two will start observing the events
  // the second two will fire the events
  
  observer.onStart(function() {.....});
  // ...
  observer.start(); // will call the function
</code>

If you inherit the Observer class and your sub-class has the <tt>EVENTS</tt>
instance or class level attribute, this attribute will be considered as a list
of supported events and generate shortcuts automatically.

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

== Call by name
The Observer class follows the general 'call by name' feature of RightJS. This
means that instead of specifying a particular function to observer, you can
specify a method name and some attributes which should be called on the event.

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

== Callbacks preprocessing
To handle various custom cases, you can specify several additional functions
to preprocess callbacks in your classes. You can do so by sending the
following keys with the options object you send to the Observer constructor or
to the {Observer.create} method.

 * wire - will be called when a callback getting registered
 * stop - will be called when a callback getting unregistered
 * wrap - will be called as a preprocessor for a callback function

All the functions will take two arguments, a string event name and the
callback function. The first two just getting called as is and you free to
do in them whatever you need. The last one meant to change the callback
function somehow and expects that you return the changed function back.


### Observer#initialize

== Semantic
  initialize([Object options])

== Description
  The generic constructor. The options might has the following keys
  
    * shorts - the list of events which needs to have shortcuts
    * wire   - called when a callback is registered
    * stop   - called when a callback is unregistered
    * wrap   - callbacks preprocessor

== Example
  var observer = new Observer();
  var observer = new Observer({
    shorts: ['start', 'stop']
  });
  
### Observer.create

== Semantic
  Observer.create(Object object[, Object options]) -> Object observable

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
  observe(String name, Function callback) -> Observer self
  observe(String name, String method_name[, arguments]) -> Observer self

== Description
  Makes the observer observe the event with the callback.

== Example
  var observer = new Observer();
  
  observer.observe('something', function() {...});
  
  // or
  observer.observe('something', 'observer_method_name', arg1, arg2);
  

### Observer#on

== Semantic
  on(String name, Function callback) -> Observer self
  on(String name, String method_name[, arguments]) -> Observer self

== Description
  Short alias for {Observer#observe}

== Example
  var observer = new Observer();
  
  observer.on('something', function() {...});
  observer.on('something', 'observer_method_name', arg1, arg2);
  

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
  fire(String name[, options]) -> Observer self

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
  
