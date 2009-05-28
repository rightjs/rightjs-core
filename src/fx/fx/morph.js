/**
 * This class provides the basic element morphig effect
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Morph = new Class(Fx, {
  /**
   * basic constructor
   *
   * @param mixed element
   * @param Object options
   */
  initialize: function(element, options) {
    this.$super(options);
    this.subject = $(element);
  },
  
  /**
   * starts the effect
   *
   * @param mixed an Object with an end style or a string with the end class-name(s)
   * @return Fx this
   */
  start: function(css) {
    if (isString(css)) css = this._findStyle(css);
    
    this.startStyle = {};
    this.endStyle   = css;
    
    for (var key in css) {
      this.startStyle[key] = this.subject.getStyle(key);
    }
    
    this._cleanStyles(this.startStyle, this.endStyle);
    
    return this;
  },
  
// protected
  set: function(delta) {
    for (var key in this.endStyle) {
      this.subject.style[key] = this._calcStyle(key, delta);
    }
  },
  
// private
  
  // calculates the current style value
  _calcStyle: function(key, delta) {
    var start = this.startStyle[key], end = this.endStyle[key];
    
    
  },

  // finds the style definition by the css-selector string
  _findStyle: function(selector) {
    
  },
  
  // prepares the style values to be processed faster
  _cleanStyle: function() {
    $A(arguments).each(function(style) {
      
    }, this);
  }
});