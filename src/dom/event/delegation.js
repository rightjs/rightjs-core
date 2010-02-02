/**
 * This module contains the basic events-delegation feature support
 *
 * USAGE:
 *
 *   var delegation = Event.delegate({
 *     "css_rule_1": function() { do_something_usual(); },
 *     "css_rule_2": function() { do_something_another(); },
 *     
 *     // us also can use references by name with or without options
 *     "css_rule_3": ['addClass', 'that-class'],
 *     "css_rule_4": 'hide'
 *   });
 *
 *   $(element).on('click', delegation);
 *
 * NOTE:
 *   your delegation handler will be called in contexts of matching _targets_
 *   not in the context of the element where it was attached
 *
 * Copyright (C) 2010 Nikolay V. Nemshilov
 */
Event.delegate = function(options) {
  return function(event) {
    var target = event.target, css_rule, args, callback;
    
    for (css_rule in options) {
      if ($(this).select(css_rule).include(event.target)) {
        args = options[css_rule];
        args = isArray(args) ? args : [args];
        callback = args[0];
        args = args.slice(1);
        
        if (isString(callback)) target[callback].apply(target, args);
        else callback.apply(target, [event].concat(args));
      }
    }
  };
};

/**
 * The string level hook for quick document-level
 * delegations creating
 *
 * USAGE:
 *
 *   "ul#main-menu li".behave("click", function() { alert('clicked'); });
 *   "ul#main-menu li".behave("mouseover", "addClass", "hovered");
 *   "ul#main-menu li".behave("mouseout", "removeClass", "hovered");
 *
 *   // or like that in a shash
 *   "ul#main-menu li".behave({
 *     click:     function() { alert('clicked'); },
 *     mouseover: ['addClass',    'hovered'],
 *     mouseout:  ['removeClass', 'hovered'],
 *     dblclick:  'hide'
 *   });
 *
 * @param mixed String event name or a Hash of events
 * @param mixed Function callback or String method name
 * @param mixed optional curried arguments
 * ...
 * @return String this
 */
String.prototype.behave = function(options) {
  if (isString(options)) {
    var hash = {}, args = $A(arguments);
    hash[args.shift()] = args;
    options = hash;
  }
  
  for (var event in options) {
    var hash = {}; hash[this] = options[event];
    document.on(event, Event.delegate(hash));
  }
};