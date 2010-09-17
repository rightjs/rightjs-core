/**
 * the slide effects wrapper
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
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

    var element = old_show.call(this.element);
    this.size = element.size();

    this.styles = {};
    $w('overflow height width marginTop marginLeft').each(function(key) {
      this.styles[key] = element._.style[key];
    }, this);

    element._.style.overflow = 'hidden';
    this.onFinish('_getBack').onCancel('_getBack');

    return this.$super(this._getStyle(this.options.direction));
  },

  _getBack: function() {
    this.element.setStyle(this.styles);
  },

  // calculates the final style
  _getStyle: function(direction) {
    var style = {}, size = this.size,
      margin_left = this.styles.marginLeft.toFloat() || 0,
      margin_top  = this.styles.marginTop.toFloat() || 0;

    if (this.how == 'out') {
      style[['top', 'bottom'].includes(direction) ? 'height' : 'width'] = '0px';

      if (direction == 'right') {
        style.marginLeft = margin_left + size.x+'px';
      } else if (direction == 'bottom') {
        style.marginTop = margin_top + size.y +'px';
      }

    } else if (this.how == 'in') {
      var element_style = this.element._.style;

      if (['top', 'bottom'].includes(direction)) {
        style.height = size.y + 'px';
        element_style.height = '0px';
      } else {
        style.width = size.x + 'px';
        element_style.width = '0px';
      }

      if (direction == 'right') {
        style.marginLeft = margin_left + 'px';
        element_style.marginLeft = margin_left + size.x + 'px';
      } else if (direction == 'bottom') {
        style.marginTop = margin_top + 'px';
        element_style.marginTop = margin_top + size.y + 'px';
      }
    }

    return style;
  }

});
