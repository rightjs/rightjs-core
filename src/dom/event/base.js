/**
 * presents the basic events class
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Event.Base = new Class(Event.NATIVE, {
  extend: {
    // basic default events options
    OPTIONS: {
      bubbles:    true,
      cancelable: true,
      altKey:     false,
      ctrlKey:    false,
      shiftKey:   false,
      metaKey:    false
    },
    
    Methods: {
      stopPropagation: function() {
        this.cancelBubble = true;
      },
      
      preventDefault: function() {
        this.returnValue = false;
      },
      
      stop: function() {
        this.stopPropagation();
        this.preventDefault();
        return this;
      }
    },
    
    /**
     * the basic events extending method
     *
     * NOTE: does not process the mouse/keyboard events related extensions
     *       see the Mouse/Keyboard classes for the code
     *
     * @param Event new event
     * @return Event extended event
     */
    ext: function(event) {
      $ext(event, this.Methods, true);
      
      // TODO all the rest of the extensions in here
      
      return event;
    }
  },
  
  /**
   * basic constructor
   *
   * NOTE: that's a virtual constructor, it returns a new object instance
   *       not the actual class instance.
   * 
   * @param String event name
   * @param Object options
   * @return Event new event
   */
  initialize: function(name, options) {
    return this.build(this.options(name, options || {}));
  },
  
// protected

  /**
   * default building method
   *
   * the main purpose is that IE browsers share events instaciation interface
   *
   * @param Object options
   * @return Event new event
   */
  build: Browser.IE ? function(options) {
    var event = document.createEventObject();
    event.type = event.eventType = "on" + options.name;
    event.altKey = options.altKey;
    event.ctrlKey = options.ctrlKey;
    event.shiftKey = options.shiftKey;
    return event;
  } : null,
  
  /**
   * initial options parsing
   *
   * @params Sting event name
   * @params Object user options
   * @return Object clean options
   */
  options: function(name, options) {
    options = Object.merge({}, Event.Base.OPTIONS, this.OPTIONS, options);
    
    if (this.NAMES.includes(name)) {
      options.name = name;
    } else {
      throw("Unknown event type '"+name+"'");
    }
    return options;
  }
});