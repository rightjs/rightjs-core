= Intro

The <tt>document</tt> object in RightJS has some additional functionality.

== Document Ready

The <tt>document</tt> object has all the standard Observer functionality and 
handles the <tt>'ready'</tt> event. You can attach your listeners in any 
standard way.

<code>
  document.onReady(function() {...});
  
  document.on('ready', function() {...});
  
  document.onserve('ready', function() {...});
</code>

All the same things work on the <tt>window</tt> object, you can use it you 
like it better.



### on

== Semantic
  on(String name, Function callback[, arguments, ...]) -> document self

== Description
  Short name for the <tt>observe</tt> method

== Example
  document.on('ready', function() {....});


### observe

== Semantic
  observe(String name, Function callback[, args[, ...]]) -> document self

== Description
  The standard listeners attachment method

== Example
  document.observe('ready', function() {...});


### onReady

== Semantic
  onReady(Function callback[, arguments[, ....]]) -> document self

== Description
  Shortcut method for <tt>on('ready', ...)</tt>

== Example
  document.onReady(function() {....});

