/**
 * the elements hightlighting effect
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Fx.Highlight = new Class(Fx.Morph, {
  extend: {
    Options: Object.merge(Fx.Options, {
      color:      '#FF8',
      transition: 'Exp'
    })
  },
  
// protected
  
  /**
   * starts the transition
   *
   * @param high String the hightlight color
   * @param back String optional fallback color
   * @return self
   */
  prepare: function(start, end) {
    var element = this.element, style = element.style, end_color = end || element.getStyle('backgroundColor');
    
    if (this._transp(end_color)) {
      this.onFinish(function() { style.backgroundColor = 'transparent'; });
      end_color = this._getBGColor(element);
    }
    
    style.backgroundColor = (start || this.options.color);
    
    return this.$super({backgroundColor: end_color});
  }
});