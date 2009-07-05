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
    $ext(this, options || {});
  },
  
  stop: function() {
    this.stopped = true;
  }
});