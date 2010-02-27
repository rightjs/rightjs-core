/**
 * This module contains the basic events-delegation feature support
 *
 * Copyright (C) 2010 Nikolay V. Nemshilov
 */
Event.extend({
  /**
   * Creates an event delegation handler
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
   * @param Object delegation rules
   * @return Function delegation handler
   */
  delegate: function(options) {
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
  },
  
  /**
   * Creates a document-level events delegations catcher
   *
   * USAGE:
   *   Event.behave("ul#main-menu li", "click", function() { alert('clicked'); });
   *   Event.behave("ul#main-menu li", "mouseover", "addClass", "hovered");
   *   Event.behave("ul#main-menu li", {
   *     click:     function() { alert('clicked'); },
   *     mouseover: ['addClass',    'hovered'],
   *     mouseout:  ['removeClass', 'hovered'],
   *     dblclick:  'hide'
   *   });
   *
   * @param String css-rule
   * @param mixed String event name or a Hash of events
   * @param mixed Function callback or String method name
   * @param mixed optional curried arguments
   * @return Object with event handlers description the document.on() function will receive
   */
  behave: function(css_rule, options) {
    var events = {}, hash = {}, args = $A(arguments).slice(1);
    
    if (isString(options)) {
      hash[args.shift()] = args;
      options = hash;
    }
    
    for (var event in options) {
      events[event] = events[event] || [];
      var hash = {}; hash[css_rule] = options[event];
      events[event].push(Event.delegate(hash));
    }
    
    document.on(events);
    
    return events;
  }
});


String.include({
  /**
   * A shortcut for document-level events delegation handler attaching
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
   * ...
   * @return String this
   */
  behave: function() {
    Event.behave.apply(Event, [''+this].concat($A(arguments)));
    return this;
  }
});