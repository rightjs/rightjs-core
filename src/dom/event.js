/**
 * represents some additional functionality for the Event class
 *
 * NOTE: there more additional functionality for the Event class in the rightjs-goods project
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Event = new Class(Event, {
  extend: {
    NATIVE:   Event,
    
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
     * extends a native object with additional functionality
     *
     * @param Event event
     * @return Event same event but extended
     */
    ext: function(event) {
      if (!event.stop) {
        $ext(event, this.Methods, true);
        event.eventName = this.cleanName(event.type || '');
      }
      
      return event;
    },
    
    /**
     * cleans up the event name
     *
     * @param String event name
     * @return String fixed event name
     */
    cleanName: function(name) {
      name = name.toLowerCase();
      name = name.startsWith('on') ? name.slice(2) : name;
      name = name == 'contextmenu' ? 'rightclick'  : name;
      return name;
    },
    
    /**
     * returns a real, browser specific event name 
     *
     * @param String clean unified name
     * @return String real name
     */
    realName: function(name) {
      if (name == 'mousewheel' && Browser.Gecko) name = 'DOMMouseScroll';
      if (name == 'rightclick' && Browser.IE)    name = 'contextmenu';
      return name;
    }
  },
  
  /**
   * just initializes new custom event
   *
   * @param String event name
   * @param Object options
   * @return Event
   */
  initialize: function(name, options) {
    return new Event.Custom(Event.cleanName(name), options);
  }
});