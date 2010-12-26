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
  '$1$2var p=!$1.stopped&&this.parent&&this.parent();p&&p.fire&&p.fire($1);$3'
);

/**
 * Triggers a manual focus/blur events bubbling
 *
 * @param raw dom-event
 * @return void
 */
function focus_boobler(raw_event) {
  var event  = new Event(raw_event),
      target = event.target,
      parent = target.parent && target.parent();

  event.type = (raw_event.type === 'focusin' || raw_event.type === 'focus') ? 'focus' : 'blur';

  if (parent) { parent.fire(event); }
}

/**
 * Hooking up the 'focus' and 'blur' events
 * at the document level and then rebooble them
 * manually like they were normal events
 *
 */
if (Browser.IE) {
  document.attachEvent('onfocusin',  focus_boobler);
  document.attachEvent('onfocusout', focus_boobler);
} else {
  document.addEventListener('focus', focus_boobler, true);
  document.addEventListener('blur',  focus_boobler, true);
}
