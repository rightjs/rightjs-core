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

    this.element.show();
    this.sizes = this.element.sizes();
    this.styles = this._getStyle(this.element, $w('overflow height width marginTop marginLeft'));

    this.element.style.overflow = 'hidden';
    this.onFinish('_getBack').onCancel('_getBack');

    return this.$super(this._endStyle(this.options.direction));
  },

  _getBack: function() {
    this.element.setStyle(this.styles);
  },

  // calculates the final style
  _endStyle: function(direction) {
    var style = {}, sizes = this.sizes,
      margin_left = (this.styles.marginLeft || '0').toFloat(),
      margin_top  = (this.styles.marginTop  || '0').toFloat();

    if (this.how == 'out') {
      style[['top', 'bottom'].includes(direction) ? 'height' : 'width'] = '0px';

      if (direction == 'right') {
        style.marginLeft = margin_left + sizes.x+'px';
      } else if (direction == 'bottom') {
        style.marginTop = margin_top + sizes.y +'px';
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
        style.marginLeft = margin_left + 'px';
        element_style.marginLeft = margin_left + sizes.x + 'px';
      } else if (direction == 'bottom') {
        style.marginTop = margin_top + 'px';
        element_style.marginTop = margin_top + sizes.y + 'px';
      }
    }

    return style;
  }

});