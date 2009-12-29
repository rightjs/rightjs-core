# Event

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

* `which` - which mouse button was pressed (1,2,3)
* `target` - target element reference
* `relatedTarget` - the related element for the over and out mouse events
* `pageX`, `pageY` - the cursor position relative to the document
 
### .ext

    Event.ext(Event event) -> Event extended

Extends the event object with additional methods
  
    $('element').attachEvent('onclick', function(event) {
      Event.ext(event);
      
      event.stop();
    });


### .addMethods

    Event.addMethods(Object methods[, boolean dont_rewrite])

Registers additional methods for the dom events

    Event.addMethods({
      myMethod: function() {....}
    });
    
    $('my_element').onClick(function(event) {
      event.myMethod()
    });


### #stop

    stop() -> Event self

Stops the event from the further bubbling

    $('element').onContextmenu(function(e) {
      e.stop();
      $('context-menu').moveTo(e.position()).show();
    });


### #preventDefault

    preventDefault() -> void

Prevents the event defaults
  

### #stopPropagation

    stopPropagation() -> void

Stops the event propagation


### #position

    position() -> {x: NNN, y: NNN}

Returns the current event position

    $('element').onMouseover(function(event) {
      $('nice-looking-title').show().moveTo(event.position());
    });


