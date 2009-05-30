/**
 * the elements hightlighting effect
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Highlight = new Class(Fx.Morph, {
  extend: {
    DEFAULT_COLOR: 'yellow'
  },
  
  /**
   * starts the transition
   *
   * @param String the hightlight color
   * @param String optional fallback color
   * @return self
   */
  start: function(start, end) {
    var end_color = end || this._getStyle(this.element, 'backgroundColor').backgroundColor;
    if (end_color == 'transparent') {
      this.onFinish(function() {
        this.element.style.backgroundColor = 'transparent';
      });
      this.element.style.backgroundColor = end_color = '#FFF';
    }
    
    this.middleStyle = this._findStyle({backgroundColor: end_color});
    this._cleanStyle(this.middleStyle);
    
    this.swapped = false;
    
    return this.$super({backgroundColor: (start || Fx.Highlight.DEFAULT_COLOR)});
  },
  
// protected
  set: function(delta) {
    if (delta > 0.5 && !this.swapped) {
      this.startStyle = this.endStyle;
      this.endStyle   = this.middleStyle;
      this.swapped    = true;
    }
    this.$super((delta > 0.5 ? delta - 0.5 : delta) * 2);
  }
});