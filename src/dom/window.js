/**
 * the window object extensions
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(self, {
  /**
   * returns the inner-sizes of the window
   *
   * @return Object x: d+, y: d+
   */
  sizes: function() {
    return this.innerWidth ? {x: this.innerWidth, y: this.innerHeight} :
      {x: document.documentElement.clientWidth, y: document.documentElement.clientHeight};
  },
  
  /**
   * returns the scrolls for the window
   *
   * @return Object x: d+, y: d+
   */
  scrolls: function() {
    return window.pageXOffset ? {x: window.pageXOffset, y: window.pageYOffset} :
      (this.body.scrollLeft || this.body.scrollTop) ? 
      {x: this.body.scrollLeft, y: this.body.scrollTop} :
      {x: this.documentElement.scrollLeft, y: this.documentElement.scrollTop};
  },
  
  /**
   * overloading the native scrollTo method to support hashes and element references
   *
   * @param mixed number left position, a hash position, element or a string element id
   * @param number top position
   * @return window self
   */
  scrollTo: function(left, top) {
    if(isElement(left) || (isString(left) && $(left))) {
      left = $(left).position();
    }
    
    if (isHash(left)) {
      top  = left.y;
      left = left.x;
    }
    
    this._scrollTo(left, top);
    
    return this;
  },
  _scrollTo: window.scrollTo
});