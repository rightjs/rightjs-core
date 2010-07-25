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
function focus_boobler(raw_event) {
  var event  = new Event(raw_event),
      target = event.target,
      parent = target.parent && target.parent();
  
  event.type = (raw_event.type === 'focusin' || raw_event.type === 'focus') ? 'focus' : 'blur';
  
  parent && parent.fire(event);
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

if (!event_support_for('onchange')) {
  
  function get_input_value(target) {
    var element = target._,
        type    = element.type;
        
    return type === 'radio' || type === 'checkbox' ?
      element.checked : target.getValue();
  };
  
  /**
   * Emulates the 'change' event bubbling
   *
   * @param Event wrapped dom-event
   * @param Input wrapped input element
   * @return void
   */
  function change_boobler(event, target) {
    var parent  = target.parent(),
        value   = get_input_value(target);

    if (parent && ''+target._prev_value !== ''+value) {
      target._prev_value = value; // saving the value so it didn't fire up again
      event.type = 'change';
      parent.fire(event);
    }
  };
  
  /**
   * Catches the input field changes
   *
   * @param raw dom-event
   * @return void
   */
  function catch_inputs_access(raw_event) {
    var event  = $(raw_event),
        target = event.target,
        type   = target._.type,
        tag    = target._.tagName,
        input_is_radio = (type === 'radio' || type === 'checkbox');
    
    if (
      (event.type === 'click' && (input_is_radio || tag === 'SELECT')) ||
      (event.type === 'keydown' && (
        (event.keyCode == 13 && (tag !== 'TEXTAREA')) ||
        type === 'select-multiple'
      ))
    ) 
    
    change_boobler(event, target);
  };
  
  document[ADD_EVENT_METHOD]('onclick',   catch_inputs_access);
  document[ADD_EVENT_METHOD]('onkeydown', catch_inputs_access);
  
  /**
   * Catch inputs blur
   *
   * @param raw dom-event
   * @return void
   */
  function catch_input_left(raw_event) {
    var event  = $(raw_event),
        target = event.target;
    
    if (target instanceof Input) {
      change_boobler(event, target);
    }
  };
  
  if (Browser.IE) {
    document[ADD_EVENT_METHOD]('onfocusout', catch_input_left);
  } else {
    document[ADD_EVENT_METHOD]('blur', catch_input_left, true);
  }
  
  /**
   * storing the input element previous value, so we could figure out
   * if it was changed later on
   */
  document[ADD_EVENT_METHOD]('onbeforeactivate', function(event) {
    var element = $(event).target, checked = 'checked';
    
    if (element instanceof Input) {
      element._prev_value = get_input_value(element);
    }
  });
}