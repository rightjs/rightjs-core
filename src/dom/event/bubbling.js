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
 * Triggers a manual focus/blur events bubbling
 *
 * @param raw dom-event
 * @return void
 */
function focus_boobler(event) {
  var target = $(event.target || event.srcElement),
      parent = target.parent && target.parent();
  
  parent && parent.fire(
    (event.type === 'focusin' || event.type == 'focus') ?
    'focus' : 'blur', Object.without(event, 'type')
  );
};

/**
 * Hooking up the 'focus' and 'blur' events
 * at the document level and then rebooble them
 * manually like they were normal events
 *
 */
if (Browser.IE) {
  document[ADD_EVENT_METHOD]('onfocusin',  focus_boobler);
  document[ADD_EVENT_METHOD]('onfocusout', focus_boobler);
} else {
  document[ADD_EVENT_METHOD]('focus', focus_boobler, true);
  document[ADD_EVENT_METHOD]('blur',  focus_boobler, true);
}

/**
 * Tests if there is the event support
 *
 * @param String event name
 * @retrun Boolean check result
 */
function event_support_for(name) {
  var e = $E('div')._;
  e.setAttribute(name, ';');
  return isFunction(e[name]);
};

if (!event_support_for('onsubmit')) {
  /**
   * Emulates the 'submit' event bubbling for IE browsers
   *
   * @param raw dom-event
   * @return void
   */
  function submit_boobler(raw_event) {
    var event = $(raw_event), element = event.target._,
        type = element.type, form = element.form, parent;
    
    if (form && (parent = $(form).parent()) && (
      (raw_event.keyCode === 13   && (type === 'text'   || type === 'password')) ||
      (raw_event.type === 'click' && (type === 'submit' || type === 'image'))
    )) {
      event.type   = 'submit';
      event.target = $(form);
      parent.fire(event);
    }
  };
  
  document[ADD_EVENT_METHOD]('onclick',    submit_boobler);
  document[ADD_EVENT_METHOD]('onkeypress', submit_boobler);
  
}
