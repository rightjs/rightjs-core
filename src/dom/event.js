/**
 * represents some additional functionality for the Event class
 *
 * NOTE: there more additional functionality for the Event class in the rightjs-goods project
 *
 * Credits:
 *   The additional method names are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Event = new Class(Event, {
  extend: {
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
      },
      
      position: function() {
        return {x: this.pageX, y: this.pageY};
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
        
        if (Browser.IE) {
          // faking the which button
          if (event.type == 'click' || event.type == 'dblclick') {
            event.which = 1;
          } else if (event.type == 'contextmenu') {
            event.which = 3;
          } else {
            event.which = event.button == 2 ? 3 : event.button == 4 ? 2 : 1;
          }
          
          // faking the mouse position
          var scrolls = window.scrolls();

          event.pageX = event.clientX + scrolls.x;
          event.pageY = event.clientY + scrolls.y;


          // faking the relatedElement
          event.relatedElement = event.type == 'mouseover' ? event.fromEvent :
            event.type == 'mouseout' ? event.toEvent : null;

          // faking the target property  
          event.target = event.srcElement;
        }
      }
      
      // Safari bug fix
      if (event.target && event.target.nodeType == 3)
        event.target = event.target.parentNode;
      
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
      name = name == 'rightclick'  ? 'contextmenu' : name;
      return name;
    },
    
    /**
     * returns a real, browser specific event name 
     *
     * @param String clean unified name
     * @return String real name
     */
    realName: function(name) {
      if (Browser.Gecko     && name == 'mousewheel')  name = 'DOMMouseScroll';
      if (Browser.Konqueror && name == 'contextmenu') name = 'rightclick';
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

try {
  // boosting up the native events by preextending the prototype if available
  $ext(Event.parent.prototype, Event.Methods, true);
} catch(e) {};
