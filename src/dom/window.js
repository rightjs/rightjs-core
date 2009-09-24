/**
 * the window object extensions
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(self, (function(win) {
  var old_scroll = win.scrollTo;
  
return {
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
      return (this.pageXOffset || this.pageYOffset) ? {x: this.pageXOffset, y: this.pageYOffset} :
        (this.document.body.scrollLeft || this.document.body.scrollTop) ? 
        {x: this.document.body.scrollLeft, y: this.document.body.scrollTop} :
        {x: this.document.documentElement.scrollLeft, y: this.document.documentElement.scrollTop};
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

})(window));