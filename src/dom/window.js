/**
 * the window object extensions
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
var Window = RightJS.Window = new Class(Wrapper, {

  /**
   * returns the inner-size of the window
   *
   * @return Object x: d+, y: d+
   */
  size: function() {
    var win = this._, html = win.document.documentElement;
    return win.innerWidth ? {x: win.innerWidth, y: win.innerHeight} :
      {x: html.clientWidth, y: html.clientHeight};
  },

  /**
   * returns the scrolls for the window
   *
   * @return Object x: d+, y: d+
   */
  scrolls: function() {
    var win = this._, doc = win.document, body = doc.body, html = doc.documentElement;

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
    var left_pos = left, top_pos = top,
        element = isNumber(left) ? null : $(left);

    if(element instanceof Element) {
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
