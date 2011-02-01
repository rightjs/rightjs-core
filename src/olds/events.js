/**
 * Making the 'submit' and 'change' events bubble under IE browsers
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */

/**
 * Tests if there is the event support
 *
 * @param String event name
 * @retrun Boolean check result
 */
function event_support_for(name, tag) {
  var e = document.createElement(tag);
  e.setAttribute(name, ';');
  return isFunction(e[name]);
}

if (!event_support_for('onsubmit', 'form')) {
  /**
   * Emulates the 'submit' event bubbling for IE browsers
   *
   * @param raw dom-event
   * @return void
   */
  var submit_boobler = function(raw_event) {
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

  document.attachEvent('onclick',    submit_boobler);
  document.attachEvent('onkeypress', submit_boobler);
}

if (!event_support_for('onchange', 'input')) {

  var get_input_value = function(target) {
    var element = target._,
        type    = element.type;

    return type === 'radio' || type === 'checkbox' ?
      element.checked : target.getValue();
  },

  /**
   * Emulates the 'change' event bubbling
   *
   * @param Event wrapped dom-event
   * @param Input wrapped input element
   * @return void
   */
  change_boobler = function(event, target) {
    var parent  = target.parent(),
        value   = get_input_value(target);

    if (parent && ''+target._prev_value !== ''+value) {
      target._prev_value = value; // saving the value so it didn't fire up again
      event.type = 'change';
      parent.fire(event);
    }
  },

  /**
   * Catches the input field changes
   *
   * @param raw dom-event
   * @return void
   */
  catch_inputs_access = function(raw_event) {
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
    ) {
      change_boobler(event, target);
    }
  },

  /**
   * Catch inputs blur
   *
   * @param raw dom-event
   * @return void
   */
  catch_input_left = function(raw_event) {
    var event  = $(raw_event),
        target = event.target;

    if (target instanceof Input) {
      change_boobler(event, target);
    }
  };

  document.attachEvent('onclick',    catch_inputs_access);
  document.attachEvent('onkeydown',  catch_inputs_access);
  document.attachEvent('onfocusout', catch_input_left);

  /**
   * storing the input element previous value, so we could figure out
   * if it was changed later on
   */
  document.attachEvent('onbeforeactivate', function(event) {
    var element = $(event).target;

    if (element instanceof Input) {
      element._prev_value = get_input_value(element);
    }
  });
}
