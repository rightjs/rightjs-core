/**
 * the window object extensions
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov
 */
$ext(window, (function() {
  var old_scroll = window.scrollTo;
  
return {
    /**
     * returns the inner-sizes of the window
     *
     * @return Object x: d+, y: d+
     */
    sizes: function() {
      var doc_e = document.documentElement;
      return this.innerWidth ? {x: this.innerWidth, y: this.innerHeight} :
        {x: doc_e.clientWidth, y: doc_e.clientHeight};
    },

    /**
     * returns the scrolls for the window
     *
     * @return Object x: d+, y: d+
     */
    scrolls: function() {
      var body = this.document.body, doc_e = this.document.documentElement,
        off_x = 'pageXOffset', off_y = 'pageYOffset',
        scr_x = 'scrollLeft',  scr_y = 'scrollTop';
      
      return (this[off_x] || this[off_y]) ? {x: this[off_x], y: this[off_y]} :
        (body[scr_x] || body[scr_y]) ? {x: body[scr_x], y: body[scr_y]} :
        {x: doc_e[scr_x], y: doc_e[scr_y]};
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
      
      old_scroll(left, top);

      return this;
    }
};

})());