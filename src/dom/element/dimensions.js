/**
 * this module contains the Element's part of functionality 
 * responsible for the dimensions and positions getting/setting
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Element.addMethods({
  
  sizes: function() {
    var dims = this.dimensions();
    return { x: dims.width, y: dims.height };
  },
  
  position: function() {
    var dims = this.dimensions();
    return { x: dims.left, y: dims.top };
  },
  
  scrolls: function() {
    return { x: this.scrollLeft, y: this.scrollTop };
  },
  
  /**
   * returns the element dimensions hash
   *
   * @return Object dimensions (top, left, width, height, scrollLeft, scrollTop)
   */
  dimensions: function() {
    var left = 0, top = 0, width = this.offsetWidth, height = this.offsetHeight;
    
    if (this.getBoundingClientRect) {
      var rect = this.getBoundingClientRect(), doc = this.ownerDocument.documentElement, scrolls = window.scrolls();
      
      left   = rect.left + scrolls.x - doc.clientLeft;
      top    = rect.top  + scrolls.y - doc.clientTop;
      width  = rect.width;
      height = rect.height;
    } else {
      // Manual version
      var element = this;
      while (element && element.tagName) {
        left += element.offsetLeft;
        top  += element.offsetTop;
        do 
          element = element.parentNode;
        while (element.tagName == 'P') // P tags screw the position calculation
      }
    }
    
    return {
      top:        top,
      left:       left,
      width:      width,
      height:     height,
      scrollLeft: this.scrolls().x,
      scrollTop:  this.scrolls().y
    };
  },
  
  /**
   * sets the width of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param Integer width in pixels
   * @return Element self
   */
  setWidth: function(width_px) {
    this.style.width = width_px + 'px';
    if (this.offsetWidth) this.style.width = (2 * width_px - this.offsetWidth) + 'px';
    return this;
  },
  
  /**
   * sets the width of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param Integer height in pixels
   * @return Element self
   */
  setHeight: function(height_px) {
    this.style.height = height_px + 'px';
    if (this.offsetHeight) this.style.height = (2 * height_px - this.offsetHeight) + 'px';
    return this;
  },
  
  /**
   * sets the size of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param Integer width in pixels or {x: 10, y: 20} like object
   * @param Integer height
   * @return Element self
   */
  resize: function(width, height) {
    if (isHash(width)) {
      height = width.y;
      width  = width.x;
    }
    
    this.setWidth(width);
    return this.setHeight(height);
  },
  
  /**
   * sets the element position (against the window corner)
   *
   * @param Integer left position in pixels or an object like {x: 10, y: 20}
   * @return Element self
   */
  moveTo: function(left, top) {
    if (isHash(left)) {
      top  = left.y;
      left = left.x;
    }
    
    // FIXME make it for real
    this.setStyle({
      marginLeft: (left - this.position().x) + 'px',
      marginTop: (top - this.position().y) + 'px'
    });
    
    return this;
  },
  
  /**
   * sets the scroll position
   *
   * @param Integer left scroll px or an object like {x: 22, y: 33}
   * @param Integer top scroll px
   * @return Element self
   */
  scrollTo: function(left, top) {
    if (isHash(left)) {
      top  = left.y;
      left = left.x;
    }
    
    this.scrollLeft = left;
    this.scrollTop  = top;
    
    return this;
  },
  
  /**
   * makes the window be scrolled to the element
   *
   * @return Element self
   */
  scrollThere: function() {
    window.scrollTo(this);
    return this;
  }
});