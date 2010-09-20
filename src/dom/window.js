/**
 * the window object extensions
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var Window = RightJS.Window = new Wrapper({
  /**
   * Basic constructor
   *
   * @param Window dom-window reference
   * @return void
   */
  initialize: function(window) {
    this._ = window;
    this.d = window.document;
  },

  /**
   * Generic API reference
   *
   * @return Window this
   */
  window: function() {
    return this;
  },

  /**
   * returns the inner-size of the window
   *
   * @return Object x: d+, y: d+
   */
  size: function() {
    var win = this._, html = this.d.documentElement;
    return win.innerWidth ? {x: win.innerWidth, y: win.innerHeight} :
      {x: html.clientWidth, y: html.clientHeight};
  },

  /**
   * returns the scrolls for the window
   *
   * @return Object x: d+, y: d+
   */
  scrolls: function() {
    var win = this._, doc = this.d, body = doc.body, html = doc.documentElement;

    return (win.pageXOffset || win.pageYOffset) ? {x: win.pageXOffset, y: win.pageYOffset} :
      (body && (body.scrollLeft || body.scrollTop)) ? {x: body.scrollLeft, y: body.scrollTop} :
      {x: html.scrollLeft, y: html.scrollTop};
  },

  /**
   * overloading the native scrollTo method to support hashes and element references
   *
   * @param mixed number left position, a hash position, element or a string element id
   * @param number top position
   * @param Object fx options
   * @return window self
   */
  scrollTo: function(left, top, fx_options) {
    var left_pos = left, top_pos = top, element = $(left); // moving the values into new vars so they didn't get screwed later on

    if(element && element instanceof Element) {
      left = element.position();
    }

    if (isHash(left)) {
      top_pos  = left.y;
      left_pos = left.x;
    }

    // checking if a smooth scroll was requested
    if (isHash(fx_options = fx_options || top) && RightJS.Fx) {
      new Fx.Scroll(this, fx_options).start({x: left_pos, y: top_pos});
    } else {
      this._.scrollTo(left_pos, top_pos);
    }

    return this;
  }
});
