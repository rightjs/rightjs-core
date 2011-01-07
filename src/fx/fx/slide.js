/**
 * the slide effects wrapper
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
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

    var element = this.element.show(),
        element_style = element._.style,
        old_styles = Object.only(
          element_style,
          'overflow', 'width', 'height',
          'marginTop', 'marginLeft'
        );

    function restore_styles() {
      for (var key in old_styles) {
        element_style[key] = old_styles[key];
      }
    }

    this.onFinish(restore_styles).onCancel(restore_styles);

    element_style.overflow = 'hidden';

    return this.$super(fx_slide_prepare_styles(
      element_style,
      element.size(),
      this.options.direction,
      this.how
    ));
  }
});

function fx_slide_prepare_styles(element_style, size, direction, how) {
  var style = {},
      margin_left = element_style.marginLeft.toFloat() || 0,
      margin_top  = element_style.marginTop.toFloat()  || 0,
      to_right  = direction === 'right',
      to_bottom = direction === 'bottom',
      vertical  = direction === 'top' || to_bottom;

  if (how === 'out') {
    style[vertical ? 'height' : 'width'] = '0px';

    if (to_right) {
      style.marginLeft = margin_left + size.x+'px';
    } else if (to_bottom) {
      style.marginTop = margin_top + size.y +'px';
    }
  } else {
    if (vertical) {
      style.height = size.y + 'px';
      element_style.height = '0px';
    } else {
      style.width = size.x + 'px';
      element_style.width = '0px';
    }

    if (to_right) {
      style.marginLeft = margin_left + 'px';
      element_style.marginLeft = margin_left + size.x + 'px';
    } else if (to_bottom) {
      style.marginTop = margin_top + 'px';
      element_style.marginTop = margin_top + size.y + 'px';
    }
  }

  return style;
}
