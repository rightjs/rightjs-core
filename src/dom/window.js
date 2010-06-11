/**
 * the window object extensions
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var native_scroll = WIN.scrollTo;

$ext(WIN, {
  /**
   * returns the inner-sizes of the window
   *
   * @return Object x: d+, y: d+
   */
  sizes: function() {
    var html = this.document.documentElement;
    return this.innerWidth ? {x: this.innerWidth, y: this.innerHeight} :
      {x: html.clientWidth, y: html.clientHeight};
  },

  /**
   * returns the scrolls for the window
   *
   * @return Object x: d+, y: d+
   */
  scrolls: function() {
    var doc = this.document, body = doc.body, html = doc.documentElement,
      off_x = 'pageXOffset', off_y = 'pageYOffset',
      scr_x = 'scrollLeft',  scr_y = 'scrollTop';
    
    return (this[off_x] || this[off_y]) ? {x: this[off_x], y: this[off_y]} :
      (body[scr_x] || body[scr_x]) ? {x: body[scr_x], y: body[scr_y]} :
      {x: html[scr_x], y: html[scr_y]};
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
    var left_pos = left, top_pos = top; // moving the values into new vars so they didn't get screwed later on
    
    if(isElement(left) || (isString(left) && $(left))) {
      left = $(left).position();
    }

    if (isHash(left)) {
      top_pos  = left.y;
      left_pos = left.x;
    }
    
    // checking if a smooth scroll was requested
    if (isHash(fx_options = fx_options || top) && RightJS.Fx) {
      new Fx.Scroll(this, fx_options).start({x: left_pos, y: top_pos});
    } else {
      native_scroll(left_pos, top_pos);
    }

    return this;
  }
});