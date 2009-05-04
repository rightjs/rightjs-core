/**
 * custom events unit, used as a mediator for the artificial events handling in the generic observer
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Event.Custom = new Class({
  /**
   * constructor
   *
   * @param String event name
   * @param Object options
   */
  initialize: function(name, options) {
    this.eventName = Event.cleanName(name);
    
    var options = options || {};
    for (var key in options) {
      this[key] = options[key];
    }
  },
  
  // just a dummy function to prevent the event extending
  stop: function() {}
});