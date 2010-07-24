/**
 * This module provides the artificial events bubbling feature
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

// patching the Element's 'fire' method again
// to make it to bypass the event to its parent
Element[PROTO].fire = patch_function(
  Element_observer.fire,
  /(\w+)(\s*=\s*\w+\.shift[\s\S]+)(return this)/m,
  '$1$2var p=!$1.stopped&&this.parent&&this.parent();p&&p.fire($1);$3'
);

/**
 * Triggers a manual event bubbling
 * for the events that don't normally bobble
 *
 * @param raw dom-event
 * @return void
 */
var reboobler = function(raw_event) {
  var event   = new Event(raw_event),
      target  = event.target;
      parent  = target.parent && target.parent();
  
  parent && parent.fire(event);
};


/**
 * Hooking up the 'focus' and 'blur' events
 * at the document level and then rebooble them
 * manually like they were normal events
 *
 */
if (Browser.IE) {
  document[IE_ADD_EVENT]('onfocusin',  reboobler);
  document[IE_ADD_EVENT]('onfocusout', reboobler);
} else {
  document[W3C_ADD_EVENT]('focus', reboobler, true);
  document[W3C_ADD_EVENT]('blur',  reboobler, true);
}