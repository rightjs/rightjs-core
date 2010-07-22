/**
 * represents some additional functionality for the Event class
 *
 * NOTE: there more additional functionality for the Event class in the rightjs-goods project
 *
 * Credits:
 *   The additional method names are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var Event = RightJS.Event = new Wrapper({
  // predefining the keys to spped up the assignments
  which:         null,
  keyCode:       null,
  
  target:        null,
  currentTarget: null,
  relatedTarget: null,
  
  pageX:         null,
  pageY:         null,
  
  /**
   * the class constructor
   *
   * @param raw dom-event
   * @param HTMLElement the bound element
   * @return void
   */
  initialize: function(event, bound_element) {
    this._             = event;
    
    this.which         = event.which;
    this.keyCode       = event.keyCode;
  
    this.target        = $(event.target);
    this.currentTarget = $(event.currentTarget);
    this.relatedTarget = $(event.relatedTarget);
  
    this.pageX         = event.pageX;
    this.pageY         = event.pageY;
  
    if (!('target' in event) && 'srcElement' in event) {
      // grabbin the IE properties
      this.which = event.button == 2 ? 3 : event.button == 4 ? 2 : 1;
    
      // faking the target property  
      this.target = $(event.srcElement) || bound_element;
    
      // faking the relatedTarget, currentTarget and other targets
      this.relatedTarget = this.target._ === event.fromElement ? $(event.toElement) : event.target;
      this.currentTarget = bound_element;
    
      // faking the mouse position
      var scrolls = this.target.win().scrolls();
    
      this.pageX = event.clientX + scrolls.x;
      this.pageY = event.clientY + scrolls.y;
    } else if (event.target && 'nodeType' in event.target && event.target.nodeType === 3) {
      // Safari fix
      this.target = $(event.target.parentNode);
    }
  },
  
  /**
   * Constructs an artifical event
   *
   * @param String event name
   * @param Object the options
   * @return Object the event object
   */
  construct: function(name, options) {
    // TODO replace with something real
    
    // building a fake event
    var event = {type: name};
    
    // applying the options
    if (isHash(options))
      $ext(event, options);
    
    this.stopped = event.bubbles === false;
      
    return event;
  },
  
  /**
   * Stops the event bubbling process
   *
   * @return RightJS.Event this
   */
  stopPropagation: function() {
    if ('stopPropagation' in this._) {
      this._.stopPropagation();
    } else {
      this._.cancelBubble = true;
    }
    this.stopped = true;
    return this;
  },
  
  /**
   * Prevents the default browser action on the event
   *
   * @return RightJS.Event this
   */
  preventDefault: function() {
    if ('preventDefault' in this._) {
      this._.preventDefault();
    } else {
      this.returnValue = false;
    }
    return this;
  },
  
  /**
   * Fully stops the event
   *
   * @return RightJS.Event this
   */
  stop: function() {
    return this.stopPropagation().preventDefault();
  },
  
  /**
   * Returns the event position
   *
   * @return Object {x: ..., y: ...}
   */
  position: function() {
    return {x: this._.pageX, y: this._.pageY};
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
        search   = $(css_rule);
    
    // limiting the targets list to the boundary element
    if (boundary > -1) {
      targets = targets.slice(0, boundary + 1);
    }
    
    return targets.first(function(element) {
      return search.include(element);
    });
  }
}),

Event_delegation_shortcuts = [];