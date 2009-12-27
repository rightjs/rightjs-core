= Intro

To provide an ability of working with the DOM-events in a cross-browser way,
RightJS as many other JavaScript frameworks provides some extensions for the
events system.

If you attach your event listeners via the RightJS interfaces, then all the
events your listeners receive will be automatically extended, otherwise, you
might need to call the {Event.ext} method on your events.

== Internet Explorer Fixes

Instead of providing some mediator interface for the dom events, to let you
work with the events in a cross-browser way, RightJS fixes the IE type of
events, creating the W3C type of attributes for the events, so that you could
work with them in IE transparently as if you had a normal browser.

The list of faked attributes is following:

 * <tt>which</tt> - which mouse button was pressed (1,2,3)
 * <tt>target</tt> - target element reference
 * <tt>relatedTarget</tt> - the related element for the over and out mouse events
 * <tt>pageX</tt>, <tt>pageY</tt> - the cursor position relative to the document
 
### Event.ext

== Semantic
  Event.ext(Event event) -> Event extended

== Description
  Extends the event object
  
== Example
  $('element').attachEvent('onclick', function(event) {
    Event.ext(event);
    
    event.stop();
  });

### Event#stop

== Semantic
  stop() -> Event self

== Description
  Stops the event from the further propagation
  
== Example
  $('element').onContextmenu(function(e) {
    e.stop();
    $('context-menu').moveTo(e.position()).show();
  })


### Event#preventDefault

== Semantic
  preventDefault() -> void

== Description
  Prevents the event defaults
  

### Event#stopPropagation

== Semantic
  stopPropagation() -> void

== Description
  Stops the event propagation


### Event#position

== Semantic
  position() -> {x: NNN, y: NNN}
  
== Description
  Returns the current event position
  
== Example
  $('element').onMouseover(function(event) {
    $('nice-looking-title').show().moveTo(event.position());
  });


### Event.addMethods

== Semantic
  Event.addMethods(Object methods[, boolean dont_rewrite])

== Description
  Registers additional methods for the dom events

== Example
  Event.addMethods({
    myMethod: function() {....}
  });

  $('my_element').onClick(function(event) {
    event.myMethod()
  });
