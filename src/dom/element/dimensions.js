/**
 * this module contains the Element's part of functionality 
 * responsible for the dimensions and positions getting/setting
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * Returns the reference to this element document
   *
   * @return RightJS.Document
   */
  doc: function() {
    return $(this._.ownerDocument);
  },
  
  /**
   * Returns the reference to this elements window
   *
   * @return RightJS.Window
   */
  win: function() {
    var doc = this.doc()._;
    return $(doc.defaultView || doc.parentWindow);
  },
  
  /**
   * Returns the element size as a hash
   *
   * @return Object {x: NNN, y: NNN}
   */
  size: function() {
    return { x: this._.offsetWidth, y: this._.offsetHeight };
  },
  
  /**
   * Returns the element absolute position
   *
   * NOTE: see the konq.js file for the manual version of the method
   *
   * @return Object {x: NNN, y: NNN}
   */
  position: function() {
    var rect    = this._.getBoundingClientRect(),
        html    = this.doc()._.documentElement,
        scrolls = this.win().scrolls();
    
    return {
      x: rect.left + scrolls.x - html.clientLeft,
      y: rect.top  + scrolls.y - html.clientTop
    };
  },
  
  /**
   * Returns the element scrolls
   *
   * @return Object {x: NNN, y: NNN}
   */
  scrolls: function() {
    return { x: this._.scrollLeft, y: this._.scrollTop };
  },
  
  /**
   * returns the element dimensions hash
   *
   * @return Object dimensions (top, left, width, height, scrollLeft, scrollTop)
   */
  dimensions: function() {
    var size     = this.size(),
        scrolls  = this.scrolls(),
        position = this.position();
    
    return {
      top:        position.y,
      left:       position.x,
      width:      size.x,
      height:     size.y,
      scrollLeft: scrolls.x,
      scrollTop:  scrolls.y
    };
  },
  
  /**
   * Checks if the element overlaps the given position
   *
   * @param Object position {x: NNN, y: NNN}
   * @return boolean check result
   */
  overlaps: function(target) {
    var pos = this.position(), size = this.size();
    
    return target.x > pos.x && target.x < (pos.x + size.x)
        && target.y > pos.y && target.y < (pos.y + size.y);
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
    var style = this._.style;
    style.width = width_px + 'px';
    style.width = (2 * width_px - this._.offsetWidth) + 'px';
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
    var style = this._.style;
    style.height = height_px + 'px';
    style.height = (2 * height_px - this._.offsetHeight) + 'px';
    return this;
  },
  
  /**
   * sets the size of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param width Integer width in pixels or {x: 10, y: 20} like object
   * @param height Integer height
   * @return Element self
   */
  resize: function(width, height) {
    if (isHash(width)) {
      height = width.y;
      width  = width.x;
    }
    return this.setWidth(width).setHeight(height);
  },
  
  /**
   * sets the element position (against the window corner)
   *
   * @param left Number left position in pixels or an object like {x: 10, y: 20}
   * @param top Number top position in pixels
   * @return Element self
   */
  moveTo: function(left, top) {
    if (isHash(left)) {
      top  = left.y;
      left = left.x;
    }
    
    return this.setStyle({
      left: left + 'px',
      top:  top  + 'px'
    });
  },
  
  /**
   * sets the scroll position
   *
   * @param left Integer left scroll px or an object like {x: 22, y: 33}
   * @param top Integer top scroll px
   * @return Element self
   */
  scrollTo: function(left, top) {
    if (isHash(left)) {
      top  = left.y;
      left = left.x;
    }
    
    this._.scrollLeft = left;
    this._.scrollTop  = top;
    
    return this;
  },
  
  /**
   * makes the window be scrolled to the element
   *
   * @param Object fx options
   * @return Element self
   */
  scrollThere: function(options) {
    this.win().scrollTo(this, options);
    return this;
  }
});