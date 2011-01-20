/**
 * This module provides correct focus/blur events bubbling
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */

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

  event.type = raw_event.type === 'focusin' || raw_event.type === 'focus' ? 'focus' : 'blur';

  if (parent) { parent.fire(event); }
}

/**
 * Hooking up the 'focus' and 'blur' events
 * at the document level and then rebooble them
 * manually like they were normal events
 *
 */
if (IE8_OR_LESS) {
  document.attachEvent('onfocusin',  focus_boobler);
  document.attachEvent('onfocusout', focus_boobler);
} else {
  document.addEventListener('focus', focus_boobler, true);
  document.addEventListener('blur',  focus_boobler, true);
}
