/**
 * the slide effects wrapper
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Slide = new Class(Fx.Tween, {
  extend: {
    OPTIONS: Object.merge(Fx.OPTIONS, {
      direction: 'top'
    })
  },
  
  start: function(how) {
    this.setHow(how);

    this.element.show();
    this.sizes = this.element.sizes();
    this.styles = this._getStyle(this.element, $w('overflow height width marginTop marginLeft'));

    this.element.style.overflow = 'hidden';
    this.onFinish('_getBack').onCancel('_getBack');

    return this.$super(this._endStyle(this.options.direction));
  },

// protected
  _getBack: function() {
    this.element.setStyle(this.styles);
  },

  // calculates the final style
  _endStyle: function(direction) {
    var style = {}, marginLeft = this.styles.marginLeft.toFloat(), marginTop = this.styles.marginTop.toFloat();

    if (this.how == 'out') {
      style[['top', 'bottom'].includes(direction) ? 'height' : 'width'] = '0px';

      if (direction == 'right') {
        style['marginLeft'] = marginLeft + this.sizes.x+'px';
      } else if (direction == 'bottom') {
        style['marginTop'] = marginTop + this.sizes.y +'px';
      }

    } else if (this.how == 'in') {      
      if (['top', 'bottom'].includes(direction)) {
        style['height'] = this.sizes.y + 'px';
        this.element.style.height = '0px';
      } else {
        style['width'] = this.sizes.x + 'px';
        this.element.style.width = '0px';
      }

      if (direction == 'right') {
        this.element.style.marginLeft = marginLeft + this.sizes.x + 'px';
        style['marginLeft'] = marginLeft + 'px';
      } else if (direction == 'bottom') {
        this.element.style.marginTop = marginTop + this.sizes.y + 'px';
        style['marginTop'] = marginTop + 'px';
      }
    }

    return style;
  }

});