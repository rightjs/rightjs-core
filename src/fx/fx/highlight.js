/**
 * the elements hightlighting effect
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Highlight = new Class(Fx.Morph, {
  extend: {
    DEFAULT_COLOR: '#FEF'
  },
  
  /**
   * starts the transition
   *
   * @param String the hightlight color
   * @param String optional fallback color
   * @return self
   */
  start: function(start, end) {
    this.$super({backgroundColor: (start || Fx.Highlight.DEFAULT_COLOR)});
    
    this.middleStyle = {backgroundColor: (end || this.subject.getStyle('background-color'))};
    
    this._cleanStyles(this.middleStyle);
    
    return this;
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