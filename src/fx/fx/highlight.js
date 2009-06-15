/**
 * the elements hightlighting effect
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Highlight = new Class(Fx.Morph, {
  extend: {
    Options: Object.merge(Fx.Options, {
      color:      '#FF8',
      transition: 'Sin'
    })
  },
  
// protected
  
  /**
   * starts the transition
   *
   * @param String the hightlight color
   * @param String optional fallback color
   * @return self
   */
  prepare: function(start, end) {
    var end_color = end || this._getStyle(this.element, 'backgroundColor');
    
    if (end_color == 'transparent' || end_color == 'rgba(0, 0, 0, 0)') {
      this.onFinish(function() { this.element.style.backgroundColor = 'transparent'; });
      end_color = '#FFF';
    }
    
    this.element.style.backgroundColor = (start || this.options.color);
    
    return this.$super({backgroundColor: end_color});
  }
});