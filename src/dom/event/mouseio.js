/**
 * Provides the mouse enter/leave events handling emulation
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var mouse_io_index = [], mouse_io_active = false;

/**
 * Fires the actual mouseenter/mouseleave event
 *
 * @param raw dom element
 * @param integer uid
 * @param boolean mouseenter or mouseleave
 * @return void
 */
function mouse_io_fire(element, uid, enter) {
  var event = new Event(enter ? 'mouseenter' : 'mouseleave', {target: element}).stop();
  event.target.fire(event);
  $(document).fire(event);
}

/**
 * Figures out the enter/leave events by listening the
 * mouseovers in the document
 *
 * @param raw dom event
 * @return void
 */
function mouse_io_handler(e) {
  if (mouse_io_active) {
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
}

/**
 * Calling 'mouseleave' for all currently active elements on the page
 *
 * @return void
 */
function mouse_io_reset() {
  mouse_io_index.each(function(value, uid) {
    if (value && Wrappers_Cache[uid]) {
      mouse_io_fire(Wrappers_Cache[uid]._, uid, false);
    }
  });
}

if (looks_like_ie) {
  document.attachEvent('onmouseover', mouse_io_handler);
  wondow.attachEvent('blur', mouse_io_reset);
} else {
  document.addEventListener('mouseover', mouse_io_handler, false);
  window.addEventListener('blur', mouse_io_reset, false);
}


Element_add_event_shortcuts('mouseenter mouseleave');