/**
 * the slide effects wrapper
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Slide = new Class(Fx.Twin, {
  extend: {
    Options: Object.merge(Fx.Options, {
      direction: 'top'
    })
  },
  
// protected  
  prepare: function(how) {
    this.setHow(how);
    
    var element = this.element;
    element.show();
    this.sizes = element.sizes();
    
    this.styles = {};
    $w('overflow height width marginTop marginLeft').each(function(key) {
      this.styles[key] = element.style[key];
    }, this);

    element.style.overflow = 'hidden';
    this.onFinish('_getBack').onCancel('_getBack');

    return this.$super(this._getStyle(this.options.direction));
  },

  _getBack: function() {
    this.element.setStyle(this.styles);
  },

  // calculates the final style
  _getStyle: function(direction) {
    var style = {}, sizes = this.sizes,
      m_left = 'marginLeft', m_top = 'marginTop',
      margin_left = this.styles[m_left].toFloat() || 0,
      margin_top  = this.styles[m_top].toFloat() || 0;

    if (this.how == 'out') {
      style[['top', 'bottom'].includes(direction) ? 'height' : 'width'] = '0px';

      if (direction == 'right') {
        style[m_left] = margin_left + sizes.x+'px';
      } else if (direction == 'bottom') {
        style[m_top] = margin_top + sizes.y +'px';
      }

    } else if (this.how == 'in') {
      var element_style = this.element.style;
      
      if (['top', 'bottom'].includes(direction)) {
        style.height = sizes.y + 'px';
        element_style.height = '0px';
      } else {
        style.width = sizes.x + 'px';
        element_style.width = '0px';
      }

      if (direction == 'right') {
        style[m_left] = margin_left + 'px';
        element_style[m_left] = margin_left + sizes.x + 'px';
      } else if (direction == 'bottom') {
        style[m_top] = margin_top + 'px';
        element_style[m_top] = margin_top + sizes.y + 'px';
      }
    }
    
    return style;
  }

});