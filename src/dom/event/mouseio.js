/**
 * Provides the mouse enter/leave events handling emulation
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var mouse_io_index = [];

function mouse_io_fire(element, uid, enter) {
  var event = new Event(enter ? 'mouseenter' : 'mouseleave', {target: element}).stop();
  if (Wrappers_Cache[uid] !== undefined) {
    Wrappers_Cache[uid].fire(event);
  }
  $(document).fire(event);
}

function mouse_io_handler(e) {
  var target  = e.target        || e.srcElement,
      from    = e.relatedTarget || e.fromElement,
      element = target,
      passed  = false,
      uid, event;

  while (element.nodeType === 1) {
    uid = $uid(element);

    if (!mouse_io_index[uid]) {
      mouse_io_fire(element, uid,
        mouse_io_index[uid] = true
      );
    }

    if (element === from) {
      passed = true;
    }

    element = element.parentNode;
  }

  if (from && !passed) {
    while (from.nodeType === 1 && from !== target) {
      uid = $uid(from);
      if (mouse_io_index[uid]) {
        mouse_io_fire(from, uid,
          mouse_io_index[uid] = false
        );
      }

      from = from.parentNode;
    }
  }
}


if (looks_like_ie) {
  document.attachEvent('onmouseover', mouse_io_handler);
} else {
  document.addEventListener('mouseover', mouse_io_handler, false);
}


Element_add_event_shortcuts('mouseenter mouseleave');