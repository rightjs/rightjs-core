/**
 * represents some additional functionality for the Event class
 *
 * NOTE: there more additional functionality for the Event class in the rightjs-goods project
 *
 * Credits:
 *   The additional method names are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Event = RightJS.Event = new Class(WIN.Event, {
  extend: {
    /**
     * extends a native object with additional functionality
     *
     * @param Event event
     * @param Element bounding element
     * @return Event same event but extended
     */
    ext: function(event, bound_element) {
      if (!event.stop) {
        $ext(event, Event.Methods, true);
      }
      
      if (!event.target && event.srcElement) {
        // faking the which button
        event.which = event.button == 2 ? 3 : event.button == 4 ? 2 : 1;
        
        // faking the mouse position
        var scrolls = WIN.scrolls();

        event.pageX = event.clientX + scrolls.x;
        event.pageY = event.clientY + scrolls.y;
        
        // faking the target property  
        event.target = $(event.srcElement) || bound_element;
        
        // faking the relatedTarget, currentTarget and other targets
        event.relatedTarget = event.target === event.fromElement ? $(event.toElement) : event.target;
        event.currentTarget = bound_element;
        event.eventPhase    = 3; // bubbling phase
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
      name = name.substr(0,2) === 'on' ? name.slice(2) : name;
      name = name === 'rightclick'  ? 'contextmenu' : name;
      return name;
    },
    
    /**
     * returns a real, browser specific event name 
     *
     * @param String clean unified name
     * @return String real name
     */
    realName: function(name) {
      if (Browser.Gecko     && name === 'mousewheel')  name = 'DOMMouseScroll';
      if (Browser.Konqueror && name === 'contextmenu') name = 'rightclick';
      return name;
    },
    
    // the additional methods registry
    Methods: {}
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


/**
 * Registers some additional event extendsions
 *
 * @param Object methods
 * @return void
 */
Event.include = function(methods) {
  $ext(this.Methods, methods);
  
  try { // extending the events prototype
    $ext(Event.parent[PROTO], methods, true);
  } catch(e) {};
};

// hooking up the standard extendsions
Event.include({
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
  },
  
  /**
   * Finds the element between the event target
   * and the boundary element that matches the
   * css-rule
   *
   * @param String css-rule
   * @return Element element or null
   */
  find: function(css_rule) {
    var target   = this.target,
        targets  = [target].concat(target.parents()),
        boundary = targets.indexOf(this.currentTarget),
        search   = $$(css_rule);
    
    // limiting the targets list to the boundary element
    if (boundary > -1) {
      targets = targets.slice(0, boundary + 1);
    }
    
    return targets.first(function(element) {
      return search.include(element);
    });
  }
});


