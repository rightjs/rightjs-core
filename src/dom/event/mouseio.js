/**
 * Provides the mouse enter/leave events handling emulation
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var mouse_io_index = [], mouse_io_inactive = true;

/**
 * Fires the actual mouseenter/mouseleave event
 *
 * @param original event
 * @param raw dom element
 * @param integer uid
 * @param boolean mouseenter or mouseleave
 * @return void
 */
function mouse_io_fire(raw, element, uid, enter) {
  var event = new Event(raw);
  event.type    = enter === true ? 'mouseenter' : 'mouseleave';
  event.bubbles = false;
  event.target  = wrap(element);

  // replacing the #find method so that UJS didn't
  // get broke with trying to find nested elements
  event.find = function(css_rule) {
    return $$(css_rule, true)
      .indexOf(this.target._) === -1 ?
        undefined : this.target;
  };

  event.target.fire(event);
  current_Document.fire(event);
}

/**
 * Figures out the enter/leave events by listening the
 * mouseovers in the document
 *
 * @param raw dom event
 * @return void
 */
function mouse_io_handler(e) {
  var target  = e.target        || e.srcElement,
      from    = e.relatedTarget || e.fromElement,
      element = target,
      passed  = false,
      parents = [],
      uid, event;

  while (element.nodeType === 1) {
    uid = $uid(element);

    if (mouse_io_index[uid] === undefined) {
      mouse_io_fire(e, element, uid,
        mouse_io_index[uid] = true
      );
    }

    if (element === from) {
      passed = true;
    }

    parents.push(element);

    element = element.parentNode;
  }

  if (from && !passed) {
    while (from.nodeType === 1 && parents.indexOf(from) === -1) {
      uid = $uid(from);
      if (mouse_io_index[uid] !== undefined) {
        mouse_io_fire(e, from, uid,
          mouse_io_index[uid] = undefined
        );
      }

      from = from.parentNode;
    }
  }
}

/**
 * Calling 'mouseleave' for all currently active elements on the page
 *
 * @return void
 */
function mouse_io_reset(e) {
  mouse_io_index.each(function(value, uid) {
    if (value && Wrappers_Cache[uid]) {
      mouse_io_fire(e, Wrappers_Cache[uid]._, uid, false);
    }
  });
}

/**
 * Activating the mouse-io events emulation
 *
 * @return void
 */
function mouse_io_activate() {
  if (mouse_io_inactive) {
    mouse_io_inactive = false;

    if (Browser_IE) {
      document.attachEvent('onmouseover', mouse_io_handler);
      window.attachEvent('blur', mouse_io_reset);
    } else {
      document.addEventListener('mouseover', mouse_io_handler, false);
      window.addEventListener('blur', mouse_io_reset, false);
    }
  }
}

Element_add_event_shortcuts('mouseenter mouseleave');