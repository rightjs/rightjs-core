/**
 * the window object extensions
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var Window = RightJS.Window = BuildWrapper(function(window) {
  var uid = $uid(window);
  
  if (!Wrappers_Cache[uid]) {
    this._ = window;
    this.d = window.document;
    
    Wrappers_Cache[uid] = this;
  }
  
  return Wrappers_Cache[uid];
});

Window.include({
  /**
   * returns the inner-sizes of the window
   *
   * @return Object x: d+, y: d+
   */
  sizes: function() {
    var win = this._, html = this.d[DOC_E];
    return win.innerWidth ? {x: win.innerWidth, y: win.innerHeight} :
      {x: html.clientWidth, y: html.clientHeight};
  },

  /**
   * returns the scrolls for the window
   *
   * @return Object x: d+, y: d+
   */
  scrolls: function() {
    var win = this._, doc = this.d, body = doc.body, html = doc[DOC_E],
      off_x = 'pageXOffset', off_y = 'pageYOffset',
      scr_x = 'scrollLeft',  scr_y = 'scrollTop';
    
    return (win[off_x] || win[off_y]) ? {x: win[off_x], y: win[off_y]} :
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
    var left_pos = left, top_pos = top, element = $(left); // moving the values into new vars so they didn't get screwed later on
    
    if(isElement(element)) {
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
